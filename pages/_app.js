import { ChakraProvider, extendTheme, useColorModeValue, ColorModeScript } from '@chakra-ui/react'

const config = {
  initialColorMode: 'dark',
  ussSystemDefault: false,
  colors: {}
}



const theme = extendTheme({ config })

function MyApp({ Component, pageProps }) {
  return (
  <ChakraProvider theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>
  )
}

export default MyApp
