import React, {useContext} from "react";
import {Alert, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {globalStyles} from "../styles/globalStyles";
import {Formik} from "formik";
import {editPasswordValidationSchema, editUserInfoValidationSchema} from "../validation";
import FormField from "../components/FormField";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

export default function EditProfile ({navigation}) {
    const {currentUser} = useContext(CurrentUserContext);
    const {setCurrentUser} = useContext(CurrentUserContext);

    const user = JSON.parse(currentUser);

    function onUserInfoChangeHandler(values) {
        let userUpdatedInfo = {
            "id": user.id,
            "firstName": values.firstName,
            "lastName": values.lastName,
            "email": values.email,
            "phoneNumber": values.phoneNumber,
            "password": user.password,
            "role": user.role,
            "shoppingCart": user.shoppingCart
        }

        if (userUpdatedInfo.email !== user.email) {
            Alert.alert("Confirm new email", "Confirmation link was sent to your new email");
        }

        let query = Object.keys(userUpdatedInfo)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(userUpdatedInfo[k]))
            .join('&');

        axios.put(`http://localhost:7153/Users?${query}`, userUpdatedInfo)
            .then(() => {
                AsyncStorage.setItem("user", JSON.stringify(userUpdatedInfo))
                    .then(() => {
                        setCurrentUser(JSON.stringify(userUpdatedInfo));
                        Alert.alert("Info update", "User info was successfully updated");
                    })
            })
            .catch(e => console.log(e))
            .finally(() => {
                navigation.goBack();
            });
    }

    function onPasswordChangeHandler(values) {
        let params = {
            "id": user.id,
            "newPassword": values.newPassword
        }

        let query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');

        axios.patch(`http://localhost:7153/Users/password?${query}`, params)
            .then(() => {
                user.password = params.newPassword;
                AsyncStorage.setItem("user", JSON.stringify(user))
                    .then(() => {
                        setCurrentUser(JSON.stringify(user));
                        Alert.alert("Password changing", "Password was successfully changed");
                    })
            })
            .catch(e => console.log(e))
            .finally(() => {
                navigation.goBack();
            });
    }

    function isFormValid(isValid, touched) {
        return isValid && Object.keys(touched).length !== 0;
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <KeyboardAwareScrollView
                style={globalStyles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={300}
                contentContainerStyle={{paddingBottom: 40}}
            >
                <Formik
                    initialValues={{
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phoneNumber: user.phoneNumber
                    }}
                    onSubmit={onUserInfoChangeHandler}
                    validationSchema={editUserInfoValidationSchema}
                >
                    {({
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          values,
                          errors,
                          touched,
                          isValid
                    }) => (
                            <>
                                <FormField
                                    field="firstName"
                                    label="First Name"
                                    autoCapitalize="words"
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                />

                                <FormField
                                    field="lastName"
                                    label="Last Name"
                                    autoCapitalize="words"
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                />

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
                                    field="phoneNumber"
                                    label="Phone Number"
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                    keyboardType={"phone-pad"}
                                />

                                <TouchableOpacity onPress={() => {
                                    Alert.alert("Update profile info?", "", [
                                        {
                                            text: "Yes",
                                            onPress: handleSubmit
                                        },
                                        {
                                            text: "No"
                                        }
                                    ])
                                }}>
                                    <View style={[globalStyles.submitButton,
                                        {
                                            opacity: isValid ? 1 : 0.5,
                                        }]}
                                    >
                                        <Text style={globalStyles.buttonText}>SUBMIT CHANGING</Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        )
                    }
                </Formik>

                <Formik
                    initialValues={{
                        oldPassword: user.password,
                        newPassword: "",
                        confirmNewPassword: ""
                    }}
                    onSubmit={onPasswordChangeHandler}
                    validationSchema={editPasswordValidationSchema}
                >
                    {({
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          values,
                          errors,
                          touched,
                          isValid
                    }) => (
                            <View style={{paddingTop: 25}}>
                                <FormField
                                    field="oldPassword"
                                    label="Old Password"
                                    secureTextEntry={true}
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                />

                                <FormField
                                    field="newPassword"
                                    label="New Password"
                                    secureTextEntry={true}
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                />

                                <FormField
                                    field="confirmNewPassword"
                                    label="Confirm New Password"
                                    secureTextEntry={true}
                                    values={values}
                                    touched={touched}
                                    errors={errors}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                />

                                <TouchableOpacity onPress={() => {
                                    Alert.alert("Change password?", "", [
                                        {
                                            text: "Yes",
                                            onPress: handleSubmit
                                        },
                                        {
                                            text: "No"
                                        }
                                    ])
                                }}>
                                    <View style={[globalStyles.submitButton,
                                        {
                                            opacity: isFormValid(isValid, touched) ? 1 : 0.5,
                                        }]}
                                    >
                                        <Text style={globalStyles.buttonText}>SUBMIT CHANGING</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </Formik>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}