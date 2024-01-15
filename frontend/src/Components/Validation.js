function Validation(values) {
    let error = {}
    const email_pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    const password_pattern = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/

    !email_pattern.test(values.email) ? error.email = "Email is not correct" : error.email = ""
    !password_pattern.test(values.password) ? error.password = "Password must contain 8 characters, a number and a letter" : error.password = ""
    return error;
}

export default Validation;