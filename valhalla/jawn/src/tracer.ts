/** Self-host: do not initialize dd-trace (operator APM phone-home). */
const noopSpan = {
  setTag(_k: string, _v: unknown) {},
};

const tracer = {
  scope() {
    return {
      active() {
        return null;
      },
    };
  },
  async trace<T>(
    _name: string,
    fn: (span: typeof noopSpan) => Promise<T> | T,
  ): Promise<T> {
    return fn(noopSpan);
  },
  use(_plugin: string, _opts: unknown) {},
};

export default tracer;
