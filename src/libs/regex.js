import moment from 'moment'

export const AssetRegexValidate = errors => {
    let error = errors || []
    return (data, params, message, reg) => {
        switch (typeof params) {
            case 'undefined':
                return error[0] ? error : undefined
            default:
                if (!reg.test(data)) {
                    error.push({
                        param: params,
                        msg: message
                    })
                }
                break
        }
        return error
    }
}

export const AssetRegexValidateDateTime = errors => {
    let error = errors || []
    return (data, params, message, reg) => {
        switch (typeof params) {
            case 'undefined':
                return error[0] ? error : undefined
            default:
                if (!moment(data, reg, true).isValid()) {
                    error.push({
                        param: params,
                        msg: message
                    })
                }
                break
        }
        return error
    }
}