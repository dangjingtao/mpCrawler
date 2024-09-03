export class Chain {
  fn: Function;
  next: null | Chain;
  resultMap: any;
  constructor(fn: Function) {
    this.fn = fn;
    this.next = null;
    this.resultMap = {};
  }

  setNext(next: Function) {
    const _next = new Chain(next);
    this.next = _next;
    return _next;
  }

  async passReq(...args: any): Promise<any> {
    const { result, next } = await this.fn.apply(this, arguments);
    if (next && this.next) {
      return this.next && (await this.next.passReq.apply(this.next, [result]));
    }
    return result;
  }
}
