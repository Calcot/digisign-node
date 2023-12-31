import { DSFactory } from '../factory';
import {
  CreateWebhook,
  WebhookDeleteResult,
  WebhookListResult,
  WebhookResult,
} from './types';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { RequestOptions } from '../types';
import { createRequest, getURI } from '../utils/fn';

export class Webhooks {
  headers: AxiosHeaders;
  baseConfig: AxiosRequestConfig;

  constructor(private readonly DSFactory: DSFactory) {
    this.headers = DSFactory.headers;
    this.baseConfig = {
      baseURL: getURI(DSFactory.env),
    };
  }

  protected extendConfig = (config: AxiosRequestConfig): AxiosRequestConfig => {
    return Object.assign({}, this.baseConfig, config);
  };

  workspace(workspaceId: string) {
    const headers = this.addWSIdentifier(workspaceId);
    const webhooks = new Webhooks(this.DSFactory);
    webhooks.headers = headers;
    return webhooks;
  }

  private addWSIdentifier(wsIdentifier: string) {
    const headers = new AxiosHeaders(this.headers.toJSON());
    headers.set('X-WS-Identifier', wsIdentifier);
    return headers;
  }
  async list(options?: RequestOptions) {
    const config: AxiosRequestConfig = this.extendConfig({
      method: 'GET',
      url: '/v1/webhooks',
      headers: this.headers,
      params: {
        population: JSON.stringify(options?.population ?? []),
        filter: JSON.stringify(options?.filter ?? []),
        per_page: options?.limit ?? 10,
        page: options?.page ?? 1,
        sort: options?.sort,
      },
    });
    const response = await createRequest<WebhookListResult>(config);
    return response.data;
  }

  async delete(id: string) {
    const config: AxiosRequestConfig = this.extendConfig({
      method: 'DELETE',
      url: `/v1/webhooks/${id}`,
      headers: this.headers,
    });
    const response = await createRequest<WebhookDeleteResult>(config);
    return response.data;
  }

  async get(id: string, options?: RequestOptions) {
    const config: AxiosRequestConfig = this.extendConfig({
      method: 'GET',
      url: `/v1/webhooks/${id}`,
      headers: this.headers,
      params: {
        population: JSON.stringify(options?.population ?? []),
        filter: JSON.stringify(options?.filter ?? []),
      },
    });
    const response = await createRequest<WebhookResult>(config);
    return response.data;
  }

  async rotateKey(id: string) {
    const config: AxiosRequestConfig = this.extendConfig({
      method: 'PUT',
      url: `/v1/webhooks/${id}/rotate-key`,
      headers: this.headers,
    });
    const response = await createRequest<WebhookResult>(config);
    return response.data;
  }

  async update(
    id: string,
    payload: Partial<CreateWebhook>,
    params: Record<string, any> = {},
  ) {
    const config: AxiosRequestConfig = this.extendConfig({
      method: 'PUT',
      url: `/v1/webhooks/${id}`,
      headers: this.headers,
      params,
      data: payload,
    });
    const response = await createRequest<WebhookResult>(config);
    return response.data;
  }

  async create(payload: CreateWebhook, params: Record<string, any> = {}) {
    const config: AxiosRequestConfig = this.extendConfig({
      method: 'POST',
      url: `/v1/webhooks`,
      headers: this.headers,
      params,
      data: payload,
    });
    const response = await createRequest<WebhookResult>(config);
    return response.data;
  }
}
