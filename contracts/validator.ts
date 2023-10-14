declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    percentage(): Rule
    gliph(): Rule
    gliphOrSignal(): Rule
    extendedSignal(): Rule
  }
}
