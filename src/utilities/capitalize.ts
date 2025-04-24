function capitalize<S extends string>(s: S): Capitalize<S> {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<S>;
}

export default capitalize