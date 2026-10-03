export type MessageParams = Record<string, string | number>;

/** Replaces every `{name}` placeholder in `template` with the matching param. Unknown ones are kept. */
export const formatMessage = (template: string, params?: MessageParams): string =>
  params
    ? template.replace(/\{(\w+)\}/g, (match, key: string) =>
        key in params ? String(params[key]) : match,
      )
    : template;
