import React from 'react';
import dayjs from "dayjs";
import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { styled } from '@mui/material/styles';
import {
    Container,
    Typography,
    Link,
    FormControl,
    InputLabel,
    Stack,
    Select,
    MenuItem,
    TextField,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from './Iconify';
import DateTimePicker from './DateTimePicker';
import api from "../utilities/api";

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 800,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));
export default function RegistrationForm() {
    const [showPassword, setShowPassword] = useState(false);
    const minDob = dayjs().subtract(18, "year").format("YYYY-MM-DD");
    const [role, setRole] = useState('renter');
    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const UserSchema = Yup.object().shape({
        name: Yup.string().min(5, 'Too Short!').max(50, 'Too Long!').required('First name required'),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().required('Password is required')
            .min(8, "Password must have at least 8 characters")
            .matches(/[0-9]/, "Must have a number")
            .matches(/[a-z]/, "Must have atleast one lowercase")
            .matches(/[A-Z]/, "Must have atleast one Uppercase")
            .matches(/[!@#$%^&*]/, "Must have atleast one special character"),
        confirmPassword: Yup.string().required("Please re-type your password").oneOf([Yup.ref("password"), null], "Passwords does not match"),
        dob: Yup.date().max(minDob, "Must be more than 18 years of age")
    });

    const formik = useFormik({
        initialValues: {
            role: 'renter',
            name: '',
            gender: '',
            dob: minDob,
            nationalId: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: UserSchema,
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
          const response = await api.post('/api/register', values);
          console.log(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      };

    const { values, errors, touched, handleChange, isSubmitting, getFieldProps } = formik;

    return (
        <Container maxWidth="sm">
            <ContentStyle>
                <Typography variant="h4" gutterBottom>
                    User Registration
                </Typography>
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* Role Field */}
                            <FormControl fullWidth>
                                <InputLabel
                                    id="role-select-label" margin="dense" variant="outlined" {...getFieldProps('role')} value={role}
                                    error={Boolean(touched.role && errors.role)}
                                >Select Role</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    id="role-select"
                                    {...getFieldProps('role')}
                                    value={role}
                                    label="Select Role"
                                    onChange={handleRoleChange}
                                >
                                    <MenuItem value={"host"}>Host</MenuItem>
                                    <MenuItem value={"renter"}>Renter</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Name Field */}
                            <TextField
                                fullWidth
                                autoComplete="fullname"
                                type="text"
                                label="Full Name"
                                {...getFieldProps('name')}
                                error={Boolean(touched.name && errors.name)}
                                helperText={touched.name && errors.name}
                            />

                            {/* Gender Field */}
                            <FormControl fullWidth>
                                <InputLabel
                                    id="gender-label" margin="dense" variant="outlined"
                                >Select Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    {...getFieldProps('gender')}
                                    value={values.gender}
                                    label="Select Gender"
                                    onChange={handleChange}
                                    error={Boolean(touched.gender && errors.gender)}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                                {touched.gender && errors.gender && (
                                    <Typography color="error">{errors.gender}</Typography>
                                )}
                            </FormControl>

                            {/* Date of Birth Field */}
                            <FormControl fullWidth>
                                <DateTimePicker
                                    name="dob"
                                    label="Date of Birth"
                                    {...getFieldProps('dob')}
                                    error={Boolean(touched.dob && errors.dob)}
                                />
                                {touched.dob && errors.dob && (
                                    <Typography color="error">{errors.dob}</Typography>
                                )}
                            </FormControl>

                            {/* National Identification Number Field */}
                            <TextField
                                fullWidth
                                label="National Identification Number"
                                {...getFieldProps('nationalId')}
                                error={Boolean(touched.nationalId && errors.nationalId)}
                                helperText={touched.nationalId && errors.nationalId}
                            />

                            {/* Email Field */}
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                {...getFieldProps('email')}
                                error={Boolean(touched.email && errors.email)}
                                helperText={touched.email && errors.email}
                            />

                            {/* Phone Number Field */}
                            <TextField
                                fullWidth
                                label="Phone Number"
                                {...getFieldProps('phoneNumber')}
                                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                helperText={touched.phoneNumber && errors.phoneNumber}
                            />

                            {/* Password Field */}
                            <TextField
                                fullWidth
                                autoComplete="current-password"
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                {...getFieldProps('password')}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                error={Boolean(touched.password && errors.password)}
                                helperText={touched.password && errors.password}
                            />

                            {/* Confirm Password Field */}
                            <TextField
                                fullWidth
                                autoComplete="current-password"
                                type={showPassword ? 'text' : 'password'}
                                label="Confirm Password"
                                {...getFieldProps('confirmPassword')}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                helperText={touched.confirmPassword && errors.confirmPassword}
                            />

                            {/* Submit Button */}
                            <LoadingButton
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                            >
                                Register
                            </LoadingButton>

                            {/* "Sign in" button */}
                            <Typography variant="body1">
                                Already have an account?{' '}
                                <Link href="/signin">Sign in</Link>
                            </Typography>
                        </Stack>
                    </Form>
                </FormikProvider>
            </ContentStyle>
        </Container>

    );
};