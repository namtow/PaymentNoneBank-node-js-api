import authentication_responses from './authentication_responses.js'
import data_responses from './data_responses.js'
import error_responses from './error_responses.js'
import header_responses from './header_responses.js'
import validate_responses from './validate_responses.js'
import values_responses from './values_responses.js'
import languages from './languages.js'
import countries from './countries.js'

const responses = [authentication_responses, data_responses, error_responses, header_responses, validate_responses, values_responses]

export default { responses, languages, countries }
