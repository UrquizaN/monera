import styles from "./styles";
import { Formik } from "formik";
import React, { Component } from "react";
import Logo from "../../../assets/logo.png";
import { View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TextInput } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { object as yupObject, ref as yupRef, string as yupString } from "yup";
import { auth, database } from '../../config/config';




export default class RegisterForm extends Component {

  createUserObject = async (user, { email, nome }) => {

    try {
      var newUser = {
        id: user.uid,
        email,
        nome,
        saldo: '0.00'

      }

      let ref = database.ref('users/' + user.uid)
      let snapshot = await ref.set(newUser);


    } catch (error) {
      console.log("Error accessing database: ", error);
    }




  }

  handleSubmit = async (values, formikBag) => {

    var email = values.email;
    var password = values.password;
    var nome = values.nome

    if (email !== '' && password !== '' && email !== password && nome !== '') {
      formikBag.setSubmitting(true);
      try {
        let snapshot = await auth.createUserWithEmailAndPassword(email, password);
        this.createUserObject(snapshot.user, { email, nome });

        formikBag.setSubmitting(false);
        this.props.navigation.navigate("HomeScreen");

      } catch (error) {
        formikBag.setSubmitting(false);
        console.log(error);
        alert(error)
      }
    } else {
      alert('email or password is empty..')
    }
  };

  renderForm = (
    {
      values,
      handleSubmit,
      setFieldValue,
      touched,
      errors,
      setFieldTouched,
      isValid,
      isSubmitting
    }) => (
      <KeyboardAvoidingView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>

            <View style={styles.logoContainer}>
              <Image
                source={Logo}
                style={styles.logo}>
              </Image>
            </View>

            <TextInput
              containerStyle={styles.formContainer}
              style={styles.inputText}
              placeholder="Nome completo"
              keyboardType="default"
              autoCapitalize="sentences"
              value={values.nome}
              onChangeText={value => setFieldValue("nome", value)}
              onBlur={() => setFieldTouched("nome")}
              editable={!isSubmitting}
              errorMessage={touched.nome && errors.nome ? errors.nome : undefined}
            />

            <TextInput
              containerStyle={styles.formContainer}
              style={styles.inputText}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.email}
              onChangeText={value => setFieldValue("email", value)}
              onBlur={() => setFieldTouched("email")}
              editable={!isSubmitting}
              errorMessage={touched.email && errors.email ? errors.email : undefined}
            />
            <TextInput
              containerStyle={styles.formContainer}
              style={styles.inputText}
              placeholder="Senha"
              secureTextEntry
              autoCapitalize="none"
              value={values.password}
              onChangeText={value => setFieldValue("password", value)}
              onBlur={() => setFieldTouched("password")}
              editable={!isSubmitting}
              errorMessage={touched.password && errors.password ? errors.password : undefined}
            />
            <TextInput
              containerStyle={styles.formContainer}
              style={styles.inputText}
              placeholder="Confirme a senha"
              secureTextEntry
              autoCapitalize="none"
              value={values.confirmPassword}
              onChangeText={value => setFieldValue("confirmPassword", value)}
              onBlur={() => setFieldTouched("confirmPassword")}
              editable={!isSubmitting}
              errorMessage={
                touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined
              }
            />
            <Button
              title={"Cadastrar"}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.registerButton}
              disabledStyle={styles.disabled}
              titleStyle={styles.buttonTitle}
              disabledTitleStyle={styles.buttonTitle}
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting}
              loading={isSubmitting}
              loadingProps={{ size: "large", color: "white" }}
            />
            <Button
              type="clear"
              title="Entrar"
              containerStyle={styles.loginButtonContainer}
              titleStyle={styles.loginTitle}
              onPress={() => this.props.navigation.navigate("LoginScreen")}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

    );

  render() {
    return (

      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "", nome: "" }}
        onSubmit={(values, formikBag) =>
          this.handleSubmit(values, formikBag)
        }
        validationSchema={yupObject().shape({
          email: yupString()
            .email("Email inválido")
            .required("Email é obrigatório"),
          password: yupString()
            .min(8, "Mínimo são 8 caracteres")
            .required("Senha é obrigatório"),
          confirmPassword: yupString()
            .oneOf([yupRef("password", undefined)], "As senhas não são iguais")
            .required("Confirmação de senha é obrigatório"),
          nome: yupString()
            .min(3, "Mínimo são 3 caracteres")
        })}

      >
        {(formikBag) => this.renderForm(formikBag)}
      </Formik>
    );
  }
}