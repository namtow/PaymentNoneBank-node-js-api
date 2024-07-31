export const templateResponse = (res_code, res_message, res_data = {}, Values = '') => {
    return { res_code, res_message: res_message + Values, res_data }
}