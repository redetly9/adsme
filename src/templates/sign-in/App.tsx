import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { api } from '../../api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { add } from '../../slices';
import { useAppDispatch } from '../../store';
import { registerUser, verifyUser } from '../../hooks';
import InputMask from 'react-input-mask';
interface FormElements extends HTMLFormControlsCollection {
  phone: HTMLInputElement;
  persistent: HTMLInputElement;
  smsCode: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}



export default function JoySignInSideTemplate() {
  const [ code, setCode] = useState(false)
  const [ phoneInput, setPhoneInput] = useState('')
  const [ codeInput, setCodeInput] = useState('')
  const [ inputError, setInputError] = useState(false)
  const [ codeInputError, setCodeInputError] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  const onSubmit = async (event: React.FormEvent<SignInFormElement>) => {
    event.preventDefault();
    // const formElements = event.currentTarget.elements;
    if (phoneInput.length != 11) {
      setInputError(true)
      throw console.error();
      
      
    }

    const data = {
      phone: phoneInput,
    };
    console.log('phoneInput', phoneInput);

    await registerUser(data.phone)
    setCode(true)
    // navigate('/confirm')
  }
  const onConfirm = async (event: React.FormEvent<SignInFormElement>) => {
    event.preventDefault();
    // const formElements = event.currentTarget.elements;

    if (codeInput.length != 4) {
      setCodeInputError(true)
      throw console.error();
      
      
    }
    const data = {
      phone: phoneInput,
      code: codeInput,
    };
    console.log('phoneInput', phoneInput);
    console.log('codeInput', codeInput);

    const response = await verifyUser(data.phone, data.code)
    console.log('response', response);
    
    dispatch(add(response?.data?.user?.id))
    // localStorage.token = response?.data?.token
    // localStorage.user = response?.data?.user.id
    // localStorage.phone = response?.data?.user.phone
    document.cookie = `token=${response?.data?.token}; path=/; max-age=31536000; secure`;
// Установка cookie с идентификатором пользователя, срок действия 1 год
document.cookie = `user=${response?.data?.user.id}; path=/; max-age=31536000; secure`;
// Установка cookie с номером телефона пользователя, срок действия 1 год
document.cookie = `phone=${response?.data?.user.phone}; path=/; max-age=31536000; secure`;
        navigate('/feed')
  }

  const handleChange = (e) => {
    // Получаем значение из input, введенное пользователем
    const input = e.target.value;
  
    // Удаляем все символы, кроме цифр
    const cleanedInput = input.replace(/\D/g, '');
  
    // Устанавливаем обработанное значение в состояние
    setPhoneInput(cleanedInput);
  };


    React.useEffect(() => {
 if(phoneInput.length === 11) {
  setInputError(false)
 }
 if(phoneInput.length != 11) {
  setInputError(true)
 }
 if(phoneInput.length === 1 || !phoneInput.length) {
  setInputError(false)
 }
  }, [phoneInput])

  React.useEffect(() => {
    if(codeInput.length === 4) {
      console.log('da');
      
     setCodeInputError(false)
    }
    if(codeInput.length != 4) {
      console.log('da2');
     setCodeInputError(true)
    }
    if(!codeInput.length) {
      console.log('da3');
     setCodeInputError(false)
    }
     }, [codeInput])
  
console.log('codeInput', codeInput);

  return (
    <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{

          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s',
          },
        }}
      />
      <Box
        sx={(theme) => ({
          width: { xs: '100vw', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 0.4)',
          },
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            </Box>
          </Box>
          { !code ? ( 
          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: 'hidden',
              },
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component="h1" level="h3" sx={{ margin: '0 auto' }}>
                  Sign in
                </Typography>
              </Stack>
            </Stack>
            <Stack gap={4} sx={{ mt: 2 }}>
                   <form
                onSubmit={onSubmit}
              >
         <FormControl required>
      <FormLabel>Phone</FormLabel>
      <InputMask
        mask="+7 999 999 99 99"
        value={phoneInput}
        onChange={handleChange}
        maskChar=" "
      >
        {(inputProps) => <Input {...inputProps} type="tel" name="phone" error={inputError} />}
      </InputMask>
    </FormControl>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                  </Box>
                  <Button type="submit" fullWidth>
                    Sign in
                  </Button>
                </Stack>
              </form>

            </Stack>
          </Box> ) : (

          <Box
            component="main"
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: 'hidden',
              },
            }}
          >
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography component="h1" level="h3" sx={{ margin: '0 auto' }}>
                  Confirm your phone
                </Typography>
              </Stack>
            </Stack>
            <Stack gap={4} sx={{ mt: 2 }}>
              <form
                onSubmit={onConfirm}
              >
                <FormControl required>
                  <FormLabel>Code</FormLabel>
                  <Input type="smsCode" name="smsCode" value={codeInput} onChange={e => setCodeInput(e.target.value)} error={codeInputError}  />
                </FormControl>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                  </Box>
                  <Button type="submit" fullWidth>
                    Confirm
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>)}

          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © Adsme {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          transition:
            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundImage:
              'url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)',
          },
        })}
      />
    </CssVarsProvider>
  );
}