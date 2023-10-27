declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    percentage(): Rule
    gliph(): Rule
    optionalGliphOrSignal(): Rule
    extendedSignal(): Rule
    optionalGliph(): Rule
  }
}
