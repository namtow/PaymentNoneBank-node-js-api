export default {
  group: 'VALIDATE',
  responses: [
    {
      name: 'MISSING_REQUIRED_VALUES',
      code: '4000',
      description: [
        {
          language: 'TH',
          description: 'ไม่พบค่าที่ต้องการ'
        },
        {
          language: 'EN',
          description: 'Missing required values.'
        }
      ]
    },
    {
      name: 'DECIMAL_OVER_LENGTH',
      code: '4001',
      description: [
        {
          language: 'TH',
          description: 'จำนวนทศนิยมเกินกว่าที่กำหนด'
        },
        {
          language: 'EN',
          description: 'Decimal is over length.'
        }
      ]
    },
    {
      name: 'REQUIRED_ONLY_POSITIVE_NUMBER',
      code: '4002',
      description: [
        {
          language: 'TH',
          description: 'ค่าตัวเลขต้องเป็นบวกเท่านั้น'
        },
        {
          language: 'EN',
          description: 'Required only positive number.'
        }
      ]
    },
    {
      name: 'NUMBER_NOT_EQUAL_TO_ZERO',
      code: '4003',
      description: [
        {
          language: 'TH',
          description: 'ค่าตัวเลขต้องไม่เท่ากับ 0'
        },
        {
          language: 'EN',
          description: 'Number should not equal to zero.'
        }
      ]
    },
    {
      name: 'INVALID_EMAIL_FORMAT',
      code: '4004',
      description: [
        {
          language: 'TH',
          description: 'รูปแบบอีเมลไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid Email format.'
        }
      ]
    },
    {
      name: 'INVALID_DATE_FORMAT',
      code: '4005',
      description: [
        {
          language: 'TH',
          description: 'รูปแบบวันที่ไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid Date format.'
        }
      ]
    },
    {
      name: 'INVALID_TIME_FORMAT',
      code: '4006',
      description: [
        {
          language: 'TH',
          description: 'รูปแบบเวลาไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid Time format.'
        }
      ]
    },
    {
      name: 'INVALID_DATE_TIME_FORMAT',
      code: '4007',
      description: [
        {
          language: 'TH',
          description: 'รูปแบบวันที่และเวลาไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid Date and Time format.'
        }
      ]
    },
    {
      name: 'INVALID_URL_FORMAT',
      code: '4008',
      description: [
        {
          language: 'TH',
          description: 'รูปแบบ URL ไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid URL format.'
        }
      ]
    },
    {
      name: 'CHARACTER_OVER_LENGTH',
      code: '4009',
      description: [
        {
          language: 'TH',
          description: 'จำนวนตัวอักษรเกินกว่าที่กำหนด'
        },
        {
          language: 'EN',
          description: 'Characters must be lesser than the maximum length.'
        }
      ]
    },
    {
      name: 'CHARACTER_MINIMUM_LENGTH',
      code: '4010',
      description: [
        {
          language: 'TH',
          description: 'จำนวนตัวอักษรต้องไม่ต่ำกว่าที่กำหนด'
        },
        {
          language: 'EN',
          description: 'Characters must be greater than the minimum length.'
        }
      ]
    },
    {
      name: 'SPECIAL_CHARACTER_NOT_ALLOW',
      code: '4011',
      description: [
        {
          language: 'TH',
          description: 'ไม่อนุญาตให้ใช้ตัวอักษรพิเศษ'
        },
        {
          language: 'EN',
          description: 'Special characters are not allowed.'
        }
      ]
    },
    {
      name: 'REQUIRED_ONLY_NUMBER',
      code: '4012',
      description: [
        {
          language: 'TH',
          description: 'ต้องเป็นตัวเลขเท่านั้น'
        },
        {
          language: 'EN',
          description: 'Only number is allowed.'
        }
      ]
    },
    {
      name: 'REQUIRED_ONLY_DECIMAL',
      code: '4013',
      description: [
        {
          language: 'TH',
          description: 'ต้องเป็นทศนิยมเท่านั้น'
        },
        {
          language: 'EN',
          description: 'Only decimal is allowed.'
        }
      ]
    },
    {
      name: 'REQUIRED_ONLY_STRING',
      code: '4014',
      description: [
        {
          language: 'TH',
          description: 'ต้องเป็นตัวอักษรเท่านั้น'
        },
        {
          language: 'EN',
          description: 'Only character is allowed.'
        }
      ]
    },
    {
      name: 'REQUIRED_ONLY_STRING_AND_NUMBER',
      code: '4015',
      description: [
        {
          language: 'TH',
          description: 'ต้องเป็นตัวอักษรและตัวเลขเท่านั้น'
        },
        {
          language: 'EN',
          description: 'Only character and number are allowed.'
        }
      ]
    },
    {
      name: 'FILE_EXTENSION_NOT_ALLOW',
      code: '4016',
      description: [
        {
          language: 'TH',
          description: 'ประเภทของไฟล์ไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Image extension is not allowed.'
        }
      ]
    },
    {
      name: 'INVALID_FILE_NAME',
      code: '4017',
      description: [
        {
          language: 'TH',
          description: 'ชื่อไฟล์ไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid file name.'
        }
      ]
    },
    {
      name: 'INVALID_VALUES',
      code: '4018',
      description: [
        {
          language: 'TH',
          description: 'ค่าที่ระบุไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid values.'
        }
      ]
    },
    {
      name: 'CONFIRM_PASSWORD_NOT_MATCH',
      code: '4019',
      description: [
        {
          language: 'TH',
          description: 'รหัสผ่าน และยืนยันรหัสผ่าน ไม่ตรงกัน'
        },
        {
          language: 'EN',
          description: 'Password does not match.'
        }
      ]
    },
    {
      name: 'INVALID_CURRENT_PASSWORD',
      code: '4020',
      description: [
        {
          language: 'TH',
          description: 'รหัสผ่านเดิมไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid current password.'
        }
      ]
    },
    {
      name: 'MISSING_REQUIRED_FILES',
      code: '4021',
      description: [
        {
          language: 'TH',
          description: 'ไม่พบไฟล์ที่ต้องการ'
        },
        {
          language: 'EN',
          description: 'Missing required files.'
        }
      ]
    },
    {
      name: 'REQUIRED_ONLY_ARRAY',
      code: '4022',
      description: [
        {
          language: 'TH',
          description: 'ต้องเป็น Array เท่านั้น'
        },
        {
          language: 'EN',
          description: 'Only array is allowed.'
        }
      ]
    },
    {
      name: 'INVALID_TIME_LOOKUP',
      code: '4023',
      description: [
        {
          language: 'TH',
          description: 'เวลาไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid time.'
        }
      ]
    },
    {
      name: 'CHARACTER_FIXED_LENGTH',
      code: '4024',
      description: [
        {
          language: 'TH',
          description: 'จำนวนตัวอักษรต้องไม่เกินที่กำหนด'
        },
        {
          language: 'EN',
          description: 'Invalid characters.'
        }
      ]
    },
    {
      name: 'CONFIRM_PIN_NOT_MATCH',
      code: '4025',
      description: [
        {
          language: 'TH',
          description: 'พิน และยืนยันพิน ไม่ตรงกัน'
        },
        {
          language: 'EN',
          description: 'PIN does not match.'
        }
      ]
    },
    {
      name: 'INVALID_CURRENT_PIN',
      code: '4026',
      description: [
        {
          language: 'TH',
          description: 'รหัสผ่านพินเดิมไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid current pin.'
        }
      ]
    },
    {
      name: 'REQUIRED_ONLY_OBJECT',
      code: '4027',
      description: [
        {
          language: 'TH',
          description: 'ต้องเป็น Object เท่านั้น'
        },
        {
          language: 'EN',
          description: 'Only object is allowed.'
        }
      ]
    },
    {
      name: 'ONLY_URL_VALUES',
      code: '5109',
      description: [
        {
          language: 'TH',
          description: 'รูปแบบ URL ผิด'
        },
        {
          language: 'EN',
          description: 'Data is not url type.'
        }
      ]
    },
    {
      name: 'FIREBASE_TOKEN_IS_NOT_VALID',
      code: '5110',
      description: [
        {
          language: 'TH',
          description: 'Firebase token ไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Firebase token is not valid.'
        }
      ]
    },
    {
      name: 'CURRENCY_NOT_FOUND',
      code: '5111',
      description: [
        {
          language: 'TH',
          description: 'ไม่พบเหรียญ'
        },
        {
          language: 'EN',
          description: 'Currency not found.'
        }
      ]
    },
    {
      name: 'EMAIL_IS_UNAVAILABLE',
      code: '5112',
      description: [
        {
          language: 'TH',
          description: 'ไม่สามารถใช้อีเมลนี้ได้'
        },
        {
          language: 'EN',
          description: 'This email is unavailable.'
        }
      ]
    },
    {
      name: 'INVALID_PIN_CODE',
      code: '5113',
      description: [
        {
          language: 'TH',
          description: 'รหัสพินไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'Invalid pin code.'
        }
      ]
    },
    {
      name: 'MANY_REQUEST_VERIFY',
      code: '5114',
      description: [
        {
          language: 'TH',
          description: 'เรียกใช้มากเกินไป'
        },
        {
          language: 'EN',
          description: 'Too many request.'
        }
      ]
    }
  ]
}
