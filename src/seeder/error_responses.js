export default {
  group: 'ERROR',
  responses: [
    {
      name: 'EMAIL_IS_ALREADY_EXISTS',
      code: '8000',
      description: [
        {
          language: 'TH',
          description: 'มีอีเมลนี้ในระบบแล้ว'
        },
        {
          language: 'EN',
          description: 'Email already exists.'
        }
      ]
    },
    {
      name: 'USERNAME_IS_ALREADY_EXISTS',
      code: '8001',
      description: [
        {
          language: 'TH',
          description: 'มีชื่อผู้ใช้นี้ในระบบแล้ว'
        },
        {
          language: 'EN',
          description: 'Username already exists.'
        }
      ]
    },
    {
      name: 'PHONE_NUMBER_IS_ALREADY_EXISTS',
      code: '8002',
      description: [
        {
          language: 'TH',
          description: 'มีเบอร์โทรศัพท์นี้ในระบบแล้ว'
        },
        {
          language: 'EN',
          description: 'Phone number already exists.'
        }
      ]
    },
    {
      name: 'INSUFFICIENT_BALANCE',
      code: '8003',
      description: [
        {
          language: 'TH',
          description: 'จำนวนเงินไม่เพียงพอ โปรดตรวจสอบอีกครั้ง'
        },
        {
          language: 'EN',
          description: 'Insufficient balance, Please check your balance.'
        }
      ]
    },
    {
      name: 'INVITE_REFERENCE_KEY_NOT_FOUND',
      code: '8004',
      description: [
        {
          language: 'TH',
          description: 'ไม่พบ Invite reference key'
        },
        {
          language: 'EN',
          description: 'Invite reference key not found.'
        }
      ]
    },
    {
      name: 'ORDER_REFERENCE_KEY_NOT_FOUND',
      code: '8005',
      description: [
        {
          language: 'TH',
          description: 'ไม่พบ Order reference key'
        },
        {
          language: 'EN',
          description: 'Order reference key not found.'
        }
      ]
    },
    {
      name: 'INPUT_DIFFERENT_VALUES',
      code: '8006',
      description: [
        {
          language: 'TH',
          description: 'กรุณาระบุค่าที่ต่างกัน'
        },
        {
          language: 'EN',
          description: 'Please input different values.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_GOOGLE_STORAGE',
      code: '8007',
      description: [
        {
          language: 'TH',
          description: 'มีบางอย่างผิดปกติที่ Google Storage'
        },
        {
          language: 'EN',
          description: 'Something is wrong with Google Storage.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_STELLAR',
      code: '8008',
      description: [
        {
          language: 'TH',
          description: 'มีบางอย่างผิดปกติที่ Stellar'
        },
        {
          language: 'EN',
          description: 'Something is wrong with Stellar.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_PAYPAL_DEPOSIT_ID_NOT_FOUND',
      code: '8009',
      description: [
        {
          language: 'TH',
          description: 'PAYPAL พบข้อผิดพลาด ไม่พบ deposit_id'
        },
        {
          language: 'EN',
          description: 'Something is wrong with PAYPAL, deposit_id not found.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_PAYPAL_WITHDRAW_ID_NOT_FOUND',
      code: '8010',
      description: [
        {
          language: 'TH',
          description: 'PAYPAL พบข้อผิดพลาด ไม่พบ withdraw_id'
        },
        {
          language: 'EN',
          description: 'Something is wrong with PAYPAL, withdraw_id not found.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_IEO_ID_NOT_FOUND',
      code: '8011',
      description: [
        {
          language: 'TH',
          description: 'IEO พบข้อผิดพลาด ไม่พบ ieo_id'
        },
        {
          language: 'EN',
          description: 'Something is wrong with IEO, ieo_id not found.'
        }
      ]
    },
    {
      name: 'OTP_NOT_FOUND',
      code: '8012',
      description: [
        {
          language: 'TH',
          description: 'ไม่พบ OTP ดังกล่าว'
        },
        {
          language: 'EN',
          description: 'OTP is not found.'
        }
      ]
    },
    {
      name: 'OTP_EXPIRE',
      code: '8013',
      description: [
        {
          language: 'TH',
          description: 'OTP หมดอายุ'
        },
        {
          language: 'EN',
          description: 'OTP is expired.'
        }
      ]
    },
    {
      name: 'PIN_HAS_VALUES',
      code: '8014',
      description: [
        {
          language: 'TH',
          description: 'PIN ไม่สามารถถูกแทนที่ได้'
        },
        {
          language: 'EN',
          description: 'PIN is active.'
        }
      ]
    },
    {
      name: 'ACTION_DENIED',
      code: '8015',
      description: [
        {
          language: 'TH',
          description: 'ไม่สามารถทำรายการได้'
        },
        {
          language: 'EN',
          description: 'Action denied.'
        }
      ]
    },
    {
      name: 'PLEASE_VERIFY_OTP',
      code: '8016',
      description: [
        {
          language: 'TH',
          description: 'กรุณายืนยันรหัส OTP'
        },
        {
          language: 'EN',
          description: 'Please verify your OTP.'
        }
      ]
    },
    {
      name: 'KYC_INCOMPLETE',
      code: '8017',
      description: [
        {
          language: 'TH',
          description: 'การทำรายการยืนยันตัวตนไม่ถูกต้อง'
        },
        {
          language: 'EN',
          description: 'KYC record is incomplete.'
        }
      ]
    },
    {
      name: 'TRANSACTION_DENIED',
      code: '8018',
      description: [
        {
          language: 'TH',
          description: 'การทำรายการไม่ถูกต้อง โปรดตรวจสอบอีกครั้ง'
        },
        {
          language: 'EN',
          description: 'Transaction denied. Please try again.'
        }
      ]
    },
    {
      name: 'TRANSACTION_NOT_FOUND',
      code: '8019',
      description: [
        {
          language: 'TH',
          description: 'ไม่พบรายการธุรกรรม'
        },
        {
          language: 'EN',
          description: 'Transaction is not found.'
        }
      ]
    },
    {
      name: 'VERIFICATION_CODE_NOT_FOUND',
      code: '8020',
      description: [
        {
          language: 'TH',
          description: 'ไม่พบรหัสยืนยัน'
        },
        {
          language: 'EN',
          description: 'Verification code is not found.'
        }
      ]
    },
    {
      name: 'VERIFY_CODE_EXPIRE',
      code: '8021',
      description: [
        {
          language: 'TH',
          description: 'Verify code หมดอายุ'
        },
        {
          language: 'EN',
          description: 'Verify code is expired.'
        }
      ]
    },
    {
      name: 'SERVICE_NOT_AVAILABLE',
      code: '8022',
      description: [
        {
          language: 'TH',
          description: 'ไม่สามารถทำรายการได้'
        },
        {
          language: 'EN',
          description: 'Services is not available.'
        }
      ]
    },
    {
      name: 'TRADE_NOT_ALLOWED',
      code: '8023',
      description: [
        {
          language: 'TH',
          description: 'ไม่สามารถทำรายการซื้อขายได้'
        },
        {
          language: 'EN',
          description: 'Trade not allowed.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_REGISTER',
      code: '8024',
      description: [
        {
          language: 'TH',
          description: 'มีบางอย่างผิดปกติที่ register'
        },
        {
          language: 'EN',
          description: 'Something is wrong with register.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_PACKAGE',
      code: '8025',
      description: [
        {
          language: 'TH',
          description: 'มีบางอย่างผิดปกติที่แพ็คเก็ต'
        },
        {
          language: 'EN',
          description: 'Something is wrong with package.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_POOL',
      code: '8026',
      description: [
        {
          language: 'TH',
          description: 'มีบางอย่างผิดปกติที่พู'
        },
        {
          language: 'EN',
          description: 'Something is wrong with pool.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_SIGNALS',
      code: '8027',
      description: [
        {
          language: 'TH',
          description: 'มีบางอย่างผิดปกติที่สัญญาน'
        },
        {
          language: 'EN',
          description: 'Something is wrong with signals.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_NOTIFICATION',
      code: '8028',
      description: [
        {
          language: 'TH',
          description: 'มีบางอย่างผิดปกติที่จดหมาย'
        },
        {
          language: 'EN',
          description: 'Something is wrong with notification.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_COPY_TRADE',
      code: '8029',
      description: [
        {
          language: 'TH',
          description: 'มีบางอย่างผิดปกติที่ก๊อปปี้เทรด'
        },
        {
          language: 'EN',
          description: 'Something is wrong with copy trade.'
        }
      ]
    },
    {
      name: 'INSUFFICIENT_BALANCE_RESERVE',
      code: '8030',
      description: [
        {
          language: 'TH',
          description: 'จำนวนเงินสำรองไม่เพียงพอ โปรดตรวจสอบอีกครั้ง'
        },
        {
          language: 'EN',
          description: 'Insufficient balance reserve, Please check your activity.'
        }
      ]
    },
    {
      name: 'HAS_PROBLEM_PARAMETER',
      code: '8031',
      description: [
        {
          language: 'TH',
          description: 'มีบางอย่างผิดปกติที่พารามิเตอร์'
        },
        {
          language: 'EN',
          description: 'Something is wrong with parameter.'
        }
      ]
    }
  ]
}
