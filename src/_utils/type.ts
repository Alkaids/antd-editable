export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export const tuple = <T extends string[]>(...args: T) => args;

export const tupleNum = <T extends number[]>(...args: T) => args;

export const withDefaultProps = <P extends object, DP extends Partial<P> = Partial<P>>(
  defaultProps: DP,
  Cmp: React.ComponentType<P>,
) => {
  // 提取出必须的属性
  type RequiredProps = Omit<P, keyof DP>;

  // 重新创建我们的属性定义，通过一个相交类型，将所有的原始属性标记成可选的，必选的属性标记成可选的
  type Props = Partial<DP> & Required<RequiredProps>;

  Cmp.defaultProps = defaultProps;

  // 返回重新的定义的属性类型组件，通过将原始组件的类型检查关闭，然后再设置正确的属性类型
  return (Cmp as React.ComponentType<any>) as React.ComponentType<Props>;
};

// 原理是，将 类型 T 的所有 K 属性置为 any，
// 然后自定义 K 属性的类型，
// 由于任何类型都可以赋予 any，所以不会产生冲突
export type Weaken<T, K extends keyof T> = { [P in keyof T]: P extends K ? any : T[P] };
