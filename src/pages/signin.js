import { Box, Button, FormControl, FormLabel, Image, Input, Text, VStack } from "@chakra-ui/react";
import Logo from "../../public/images/logo-1.png"
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/atoms";
import { useNoti } from "@/context/notification";
import { useRouter } from "next/router";
import cookies from 'js-cookie'
export default function SignIn() {
    const [user, setUser] = useAtom(userAtom)
    const router = useRouter()
    const noti = useNoti()

    async function onSubmit(ev) {
        ev.preventDefault();
        const username = ev.currentTarget.email.value;
        const password = ev.currentTarget.password.value;

        console.log(username, password)

        if (!email || !password) {
            noti.addNoti("Đăng nhập lỗi", "Vui lòng nhập đầy đủ thông tin", "error", "Đóng", () => { })
        }

        await axios.post('/api/signin', { username, password }).then(res => {
            const data = res.data
            setUser(data)
            setUser({ ...data })

            cookies.set('user', JSON.stringify(data), { expires: 1 })

            noti.addNoti("Đăng nhập thành công", "Đăng nhập thành công", "success", "Đóng", () => { router.push('/') })
        }).catch(err => {
            console.log(err)
            noti.addNoti("Đăng nhập lỗi", "Tài khoản hoặc mật khẩu không đúng", "error", "Đóng", () => { })
        })


    }


    return (
        <Box>
            <Image src={Logo.src} alt="Logo" width={"full"} height={"50%"} />
            <VStack p="5" spacing={5}>
                <Text textTransform={"uppercase"} fontWeight={"600"} fontSize={"xl"}>Thông tin đăng nhập</Text>
                <form onSubmit={onSubmit}>
                    <VStack spacing={5} minW={96}>
                        <FormControl>
                            <FormLabel>Tài khoản</FormLabel>
                            <Input type='text' id="email" />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Mật khẩu</FormLabel>
                            <Input type='password' id="password" />
                        </FormControl>
                        <Button type="submit">Đăng nhập</Button>
                    </VStack>
                </form>
            </VStack>
        </Box>
    )
}