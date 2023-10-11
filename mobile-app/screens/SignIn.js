import React, {useContext} from 'react';
import {Text, SafeAreaView, View, TouchableOpacity, Alert} from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import * as SecureStore from 'expo-secure-store';
import {authorizationValidationSchema} from "../validation";
import {globalStyles} from "../styles/globalStyles";
import FormField from "../components/FormField";
import {Formik} from "formik";
import axios from "axios";
import {API_LINK} from "../consts/links";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

export default function SignIn({navigation}) {
    const {setCurrentUser} = useContext(CurrentUserContext);

    function onSignInHandler(values) {
        let user = {
            "email": values.email,
            "password": values.password
        }

        let query = Object.keys(user)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(user[k]))
            .join('&');

        try {
            axios.get(`${API_LINK}/Users/authorizeByEmail?${query}`).then((res) => {
                SecureStore.setItemAsync("user", JSON.stringify(res.data)).then(() => {
                    setCurrentUser(JSON.stringify(res.data));
                    navigation.navigate("UserPage");
                });
            }).catch((error) => {
                    let res = error.response;
                    console.log(res.data);
                    if (res.data === "user not found") {
                        Alert.alert("Unsigned user", "Want to sign up?", [
                            {
                                text: "Yes",
                                onPress: () => onSignUpHandler()
                            },
                            {
                                text: "No"
                            }
                        ])
                    } else if (res.data === "incorrect password") {
                        Alert.alert("Wrong password!");
                    } else if (res.data.includes(`email ${values.email} is not confirmed`)) {
                        Alert.alert("Email is not confirmed!",
                            "Please, use the verification link sent to your email");
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }

    function onSignUpHandler() {
        navigation.navigate('SignUp');
    }

    function isFormValid(isValid, touched) {
        return isValid && Object.keys(touched).length !== 0;
    }

    return (
        <>
            <SafeAreaView style={globalStyles.container}>
                <KeyboardAwareScrollView
                    style={globalStyles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    extraScrollHeight={150}
                >
                    <Formik
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        onSubmit={onSignInHandler}
                        validationSchema={authorizationValidationSchema}
                    >
                        {({
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              values,
                              errors,
                              touched,
                              isValid,
                          }) => (
                            <>
                                <FormField
                                    field="email"
                                    label="Email"
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    keyboardType={"email-address"}
                                />

                                <FormField
                                    field="password"
                                    label="Password"
                                    secureTextEntry={true}
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                />

                                <TouchableOpacity onPress={handleSubmit}>
                                    <View
                                        style={[
                                            globalStyles.signInButton,
                                            {
                                                opacity: isFormValid(isValid, touched) ? 1 : 0.5,
                                            }
                                        ]}
                                    >
                                        <Text style={globalStyles.buttonText}>SIGN IN</Text>
                                    </View>
                                </TouchableOpacity>

                                <Text style={[globalStyles.label, {paddingTop: 20, textAlign: 'center'}]}>
                                    Don't have an account?
                                </Text>

                                <TouchableOpacity onPress={onSignUpHandler} style={{marginTop: -15}}>
                                    <View style={globalStyles.submitButton}>
                                        <Text style={globalStyles.buttonText}>SIGN UP</Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        )}
                    </Formik>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </>
    );
}
