// TODO: move into general 'lib' folder
export type ErrorResponse = {
  code: number;
  message: string;
  error: string;
};
export function isErrorResponse(response: any): response is ErrorResponse {
  return response && response.code === 400;
}
