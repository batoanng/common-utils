/**
 * ApiMethod represents a method from the generated API client class
 *
 * For example:
 *
 * const client = new HttpClient(http);
 * client.example.getExample <-- is an ApiMethod<TReq, TRes>
 *
 */
export type ApiMethod<TReq, TRes> = (req: TReq) => Promise<TRes>;
