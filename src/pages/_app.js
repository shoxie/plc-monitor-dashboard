import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '@/layouts/Default'
import { NotificationProvider } from '@/context/notification';
import 'mac-scrollbar/dist/mac-scrollbar.css';

function MyApp({ Component, pageProps }) {
  const LayoutWrapper = Component.Layout || Layout;
  return (
    <ChakraProvider>
      <NotificationProvider>
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper>
      </NotificationProvider>
    </ChakraProvider>
  )
}

export default MyApp