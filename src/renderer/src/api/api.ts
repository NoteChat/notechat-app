/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AuthDto {
  username: string
  password: string
}

export interface UserRegisterDto {
  email: string
  password: string
  validCode: string
}

export interface UserDto {
  phone?: string
  name?: string
  password?: string
  id: number
  alias?: string
  email?: string
  aiEngine?: string
  language?: string
}

export interface PromptDto {
  id: number
  /** @example 1 */
  userId: number
  name: string
  icon: string
  description: string
  /**
   * @example "### 指令 ###
   * 将以下文本翻译成西班牙语：
   * 文本：$content
   *     "
   */
  prompt: string
  /** @example "CommandOrControl+Shift+1" */
  keybindings: string
  /** @example "0 // 0: false, 1: true" */
  isBuiltIn: number
}

export interface PromptRecordDto {
  /** @example 1 */
  userId: number
  promptId?: number
  prompt: string
  content: string
}

export interface CreateEditorDto {
  id?: number
  userId: number
  title?: string
  content: string
}

export interface UpdateEditorDto {
  id?: number
  userId?: number
  title?: string
  content?: string
}

export interface CreateGeneratorDto {
  id?: number
  result?: string
  userId: number
  title?: string
  keywords?: string
  reference?: string
  style?: string
  prompt?: string
  status?: string
  /** @format date-time */
  createdAt?: string
  /** @format date-time */
  updatedAt?: string
}

export interface UpdateGeneratorDto {
  id?: number
  result?: string
  userId?: number
  title?: string
  keywords?: string
  reference?: string
  style?: string
  prompt?: string
  status?: string
  /** @format date-time */
  createdAt?: string
  /** @format date-time */
  updatedAt?: string
}

export interface FavoriteDto {
  id?: number
  userId?: number
  title?: string
  tags?: string[]
  content?: string
  isDelete?: number
  /** @format date-time */
  createdAt?: string
  /** @format date-time */
  updatedAt?: string
}

export type GetHelloData = any

export type LoginData = any

export type RegisterData = any

export type GetValidCodeData = any

export type FindPasswordData = any

export type ResetPasswordData = any

export type GetProfileData = any

export type UpdateProfileData = any

export type FeedbackData = any

export type GetPromptData = any

export type CreatePromptData = any

export type UpdatePromptData = any

export type DeletePromptData = any

export type GetPrompt2Data = any

export type GetPromptByUserIdData = any

export type DeletePrompt2Data = any

export type AutocompleteData = any

export type ExtractTextFromImgData = any

export type UploadFileData = any

export type CreateEditorData = any

export type FindAllEditorData = any

export type FindOneEditorData = any

export type UpdateEditorData = any

export type RemoveEditorData = any

export type CreateGeneratorData = any

export type FindAllGeneratorsData = any

export type FindOneGeneratorData = any

export type UpdateGeneratorData = any

export type RemoveGeneratorData = any

export type RemoveAllGeneratorData = any

export type BatchCreateGeneratorData = any

export type CreateFavoriteData = any

export type GetUserFavoriteByTitleData = any

export type GetFavoriteData = any

export type UpdateFavoriteData = any

export type DeleteFavoriteData = any

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = ''
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join('&')
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ''
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input)
  }

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {})
      }
    }
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
        },
        signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
        body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body)
      }
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
    })
  }
}

/**
 * @title Pointer API
 * @version 1.0
 * @contact
 *
 * The API of Pointer API Service
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * No description
     *
     * @name GetHello
     * @request GET:/v1
     */
    getHello: (params: RequestParams = {}) =>
      this.request<GetHelloData, any>({
        path: `/v1`,
        method: 'GET',
        ...params
      }),

    /**
     * No description
     *
     * @name Login
     * @request POST:/v1/auth/login
     */
    login: (data: AuthDto, params: RequestParams = {}) =>
      this.request<LoginData, any>({
        path: `/v1/auth/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name Register
     * @request POST:/v1/auth/register
     */
    register: (data: UserRegisterDto, params: RequestParams = {}) =>
      this.request<RegisterData, any>({
        path: `/v1/auth/register`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name GetValidCode
     * @request GET:/v1/auth/valid
     */
    getValidCode: (
      query: {
        email: string
      },
      params: RequestParams = {}
    ) =>
      this.request<GetValidCodeData, any>({
        path: `/v1/auth/valid`,
        method: 'GET',
        query: query,
        ...params
      }),

    /**
     * No description
     *
     * @name FindPassword
     * @request POST:/v1/auth/find-password
     */
    findPassword: (data: any, params: RequestParams = {}) =>
      this.request<FindPasswordData, any>({
        path: `/v1/auth/find-password`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name ResetPassword
     * @request POST:/v1/auth/reset-password
     */
    resetPassword: (data: any, params: RequestParams = {}) =>
      this.request<ResetPasswordData, any>({
        path: `/v1/auth/reset-password`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name GetProfile
     * @request GET:/v1/user/profile
     * @secure
     */
    getProfile: (
      query: {
        id: string
      },
      params: RequestParams = {}
    ) =>
      this.request<GetProfileData, any>({
        path: `/v1/user/profile`,
        method: 'GET',
        query: query,
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name UpdateProfile
     * @request POST:/v1/user/update
     * @secure
     */
    updateProfile: (data: UserDto, params: RequestParams = {}) =>
      this.request<UpdateProfileData, any>({
        path: `/v1/user/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name Feedback
     * @request POST:/v1/user/feedback
     * @secure
     */
    feedback: (
      data: {
        email?: string
        feedback?: string
      },
      params: RequestParams = {}
    ) =>
      this.request<FeedbackData, any>({
        path: `/v1/user/feedback`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name GetPrompt
     * @request GET:/v1/prompt/query
     * @secure
     */
    getPrompt: (
      query: {
        userId: number
        limit: number
      },
      params: RequestParams = {}
    ) =>
      this.request<GetPromptData, any>({
        path: `/v1/prompt/query`,
        method: 'GET',
        query: query,
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name CreatePrompt
     * @request POST:/v1/prompt/create
     * @secure
     */
    createPrompt: (data: PromptDto, params: RequestParams = {}) =>
      this.request<CreatePromptData, any>({
        path: `/v1/prompt/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name UpdatePrompt
     * @request POST:/v1/prompt/update
     * @secure
     */
    updatePrompt: (data: PromptDto, params: RequestParams = {}) =>
      this.request<UpdatePromptData, any>({
        path: `/v1/prompt/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name DeletePrompt
     * @request POST:/v1/prompt/delete
     * @secure
     */
    deletePrompt: (data: any, params: RequestParams = {}) =>
      this.request<DeletePromptData, any>({
        path: `/v1/prompt/delete`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name GetPrompt2
     * @request GET:/v1/prompt-records/query
     * @originalName getPrompt
     * @duplicate
     * @secure
     */
    getPrompt2: (
      query: {
        userId: string
        promptId: string
        limit: string
      },
      params: RequestParams = {}
    ) =>
      this.request<GetPrompt2Data, any>({
        path: `/v1/prompt-records/query`,
        method: 'GET',
        query: query,
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name GetPromptByUserId
     * @request GET:/v1/prompt-records/queryByUserId
     * @secure
     */
    getPromptByUserId: (
      query: {
        userId: string
        limit: string
      },
      params: RequestParams = {}
    ) =>
      this.request<GetPromptByUserIdData, any>({
        path: `/v1/prompt-records/queryByUserId`,
        method: 'GET',
        query: query,
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name DeletePrompt2
     * @request POST:/v1/prompt-records/delete
     * @originalName deletePrompt
     * @duplicate
     * @secure
     */
    deletePrompt2: (data: any, params: RequestParams = {}) =>
      this.request<DeletePrompt2Data, any>({
        path: `/v1/prompt-records/delete`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name Autocomplete
     * @request POST:/v1/ai/complete
     * @secure
     */
    autocomplete: (data: PromptRecordDto, params: RequestParams = {}) =>
      this.request<AutocompleteData, any>({
        path: `/v1/ai/complete`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name ExtractTextFromImg
     * @request POST:/v1/text/extract-from-img
     * @secure
     */
    extractTextFromImg: (params: RequestParams = {}) =>
      this.request<ExtractTextFromImgData, any>({
        path: `/v1/text/extract-from-img`,
        method: 'POST',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name UploadFile
     * @request POST:/v1/text/extract-from-file
     * @secure
     */
    uploadFile: (params: RequestParams = {}) =>
      this.request<UploadFileData, any>({
        path: `/v1/text/extract-from-file`,
        method: 'POST',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name CreateEditor
     * @request POST:/v1/editor
     */
    createEditor: (data: CreateEditorDto, params: RequestParams = {}) =>
      this.request<CreateEditorData, any>({
        path: `/v1/editor`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name FindAllEditor
     * @request GET:/v1/editor
     */
    findAllEditor: (
      query: {
        userId: string
      },
      params: RequestParams = {}
    ) =>
      this.request<FindAllEditorData, any>({
        path: `/v1/editor`,
        method: 'GET',
        query: query,
        ...params
      }),

    /**
     * No description
     *
     * @name FindOneEditor
     * @request GET:/v1/editor/{id}
     */
    findOneEditor: (id: string, params: RequestParams = {}) =>
      this.request<FindOneEditorData, any>({
        path: `/v1/editor/${id}`,
        method: 'GET',
        ...params
      }),

    /**
     * No description
     *
     * @name UpdateEditor
     * @request PATCH:/v1/editor/{id}
     */
    updateEditor: (id: string, data: UpdateEditorDto, params: RequestParams = {}) =>
      this.request<UpdateEditorData, any>({
        path: `/v1/editor/${id}`,
        method: 'PATCH',
        body: data,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name RemoveEditor
     * @request DELETE:/v1/editor/{id}
     */
    removeEditor: (id: string, params: RequestParams = {}) =>
      this.request<RemoveEditorData, any>({
        path: `/v1/editor/${id}`,
        method: 'DELETE',
        ...params
      }),

    /**
     * No description
     *
     * @name CreateGenerator
     * @request POST:/v1/generator
     * @secure
     */
    createGenerator: (data: CreateGeneratorDto, params: RequestParams = {}) =>
      this.request<CreateGeneratorData, any>({
        path: `/v1/generator`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name FindAllGenerators
     * @request GET:/v1/generator
     * @secure
     */
    findAllGenerators: (
      query: {
        userId: string
      },
      params: RequestParams = {}
    ) =>
      this.request<FindAllGeneratorsData, any>({
        path: `/v1/generator`,
        method: 'GET',
        query: query,
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name FindOneGenerator
     * @request GET:/v1/generator/{id}
     * @secure
     */
    findOneGenerator: (id: string, params: RequestParams = {}) =>
      this.request<FindOneGeneratorData, any>({
        path: `/v1/generator/${id}`,
        method: 'GET',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name UpdateGenerator
     * @request PATCH:/v1/generator/{id}
     * @secure
     */
    updateGenerator: (id: string, data: UpdateGeneratorDto, params: RequestParams = {}) =>
      this.request<UpdateGeneratorData, any>({
        path: `/v1/generator/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name RemoveGenerator
     * @request POST:/v1/generator/delete
     * @secure
     */
    removeGenerator: (data: any, params: RequestParams = {}) =>
      this.request<RemoveGeneratorData, any>({
        path: `/v1/generator/delete`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name RemoveAllGenerator
     * @request POST:/v1/generator/delete-all
     * @secure
     */
    removeAllGenerator: (data: any, params: RequestParams = {}) =>
      this.request<RemoveAllGeneratorData, any>({
        path: `/v1/generator/delete-all`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name BatchCreateGenerator
     * @request POST:/v1/generator/batch-create
     * @secure
     */
    batchCreateGenerator: (data: any, params: RequestParams = {}) =>
      this.request<BatchCreateGeneratorData, any>({
        path: `/v1/generator/batch-create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name CreateFavorite
     * @request POST:/v1/favorite/create
     * @secure
     */
    createFavorite: (data: FavoriteDto, params: RequestParams = {}) =>
      this.request<CreateFavoriteData, any>({
        path: `/v1/favorite/create`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name GetUserFavoriteByTitle
     * @request GET:/v1/favorite/query
     * @secure
     */
    getUserFavoriteByTitle: (
      query: {
        userId: number
        title: string
      },
      params: RequestParams = {}
    ) =>
      this.request<GetUserFavoriteByTitleData, any>({
        path: `/v1/favorite/query`,
        method: 'GET',
        query: query,
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name GetFavorite
     * @request GET:/v1/favorite/{id}
     * @secure
     */
    getFavorite: (id: string, params: RequestParams = {}) =>
      this.request<GetFavoriteData, any>({
        path: `/v1/favorite/${id}`,
        method: 'GET',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name UpdateFavorite
     * @request POST:/v1/favorite/update
     * @secure
     */
    updateFavorite: (data: FavoriteDto, params: RequestParams = {}) =>
      this.request<UpdateFavoriteData, any>({
        path: `/v1/favorite/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name DeleteFavorite
     * @request POST:/v1/favorite/delete
     * @secure
     */
    deleteFavorite: (data: any, params: RequestParams = {}) =>
      this.request<DeleteFavoriteData, any>({
        path: `/v1/favorite/delete`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      })
  }
}
