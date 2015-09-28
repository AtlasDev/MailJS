define({ "api": [
  {
    "type": "delete",
    "url": "/2fa",
    "title": "Remove 2FA",
    "version": "0.1.0",
    "name": "Disable2FA",
    "group": "2FA",
    "description": "<p>Remove Two Factor Authentication on the user account.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Int</p> ",
            "optional": false,
            "field": "code",
            "description": "<p>One last time the TOTP value, to validate the disable request.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Valid TOTP value:",
          "content": "{\n  \"code\": \"329415\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>Success message.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"2FA disabled.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>TOTP value invalid.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"TOTP value invalid.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"TOTP value missing.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/2fa.js",
    "groupTitle": "2FA",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/2fa",
    "title": "Enable 2FA",
    "version": "0.1.0",
    "name": "Enable2FA",
    "group": "2FA",
    "description": "<p>Enable 2FA by sending a valid TOTP value. This will destroy ALL active sessions from the user (including the current), but not the OAuth tokens.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Int</p> ",
            "optional": false,
            "field": "code",
            "description": "<p>A valid TOTP value with the key send with the last key request.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Valid TOTP value:",
          "content": "{\n  \"code\": \"329415\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>Success message.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"2FA has been enabled.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>TOTP value invalid.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"TOTP value invalid.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"TOTP value missing.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/2fa.js",
    "groupTitle": "2FA",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/2fa",
    "title": "Generate key",
    "version": "0.1.0",
    "name": "Get2FA",
    "group": "2FA",
    "description": "<p>Get a key to enable 2FA with. You should generate a QR code with the URI and/or display the key to the user for manual input. The key is secret, and the 2FA layer is useless if it leaks. You need to send the post request described underneat to actually activate 2FA.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "key",
            "description": "<p>The key to display to the user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "uri",
            "description": "<p>The URI to be put as a value into the QR code.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"key\": \"KY7TSZRWFZBXCMJGHRED6PDOPBS\",\n  \"uri\": \"otpauth://totp/MailJS?secret=KY7TSZRWFZBXCMJGHRED6PDOPBS\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>2FA already enabled.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"2FA already enabled.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/2fa.js",
    "groupTitle": "2FA",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/clients",
    "title": "Create a new client",
    "version": "0.1.0",
    "name": "CreateClient",
    "group": "Clients",
    "permission": [
      {
        "name": "client.create"
      }
    ],
    "description": "<p>Create a new client with the specified data. In the response <code>secret</code> will be unencrypted. Save that somewhere secure! You need it later to exchange access tokens. You cannot recover the secret.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Desired username of the user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "url",
            "description": "<p>Image url of the logo of the client.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "scopes",
            "description": "<p>Scopes of the client, these are the same as permissions (https://github.com/AtlasDev/MailJS/wiki/Permissions).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Create a new client:",
          "content": "{\n  \"name\": \"SpaceCP\",\n  \"description\": \"Super awesome controll panel.\",\n  \"url\": \"https://spacecp.net/img/rocket.png\",\n  \"scopes\": [\n    \"mailbox.create\",\n    \"user.list\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>Simple success message</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "client",
            "description": "<p>The created client.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Client added.\";\n  \"client\": {\n    \"__v\": 0,\n    \"userId\": \"55e40dc8cf8dbadb0c352305\",\n    \"secret\": \"0cFMaxMH5i\",\n    \"id\": \"hqa2j7W7YN\",\n    \"url\": \"https://spacecp.net/img/rocket.png\",\n    \"description\": \"Super awesome controll panel.\",\n    \"name\": \"SpaceCP\",\n    \"_id\": \"55e430cbdec945f825ba6429\",\n    \"scopes\": [\n      \"mailbox.create\",\n      \"user.list\"\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>Invalid parameters.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Invalid parameters.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/client.js",
    "groupTitle": "Clients",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/clients",
    "title": "Get own clients",
    "version": "0.1.0",
    "name": "GetOwnClients",
    "group": "Clients",
    "description": "<p>Get all clients which the authenticated user owns.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>Simple response message</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Int</p> ",
            "optional": false,
            "field": "amount",
            "description": "<p>Amount of client received.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "clients",
            "description": "<p>A list of client objects.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Clients recieved.\",\n  \"amount\": \"2\",\n  \"clients\": [\n    {\n      \"_id\": \"55e430cbdec945f825ba6429\",\n      \"userId\": \"55e40dc8cf8dbadb0c352305\",\n      \"id\": \"hqa2j7W7YN\",\n      \"url\": \"https://spacecp.net/img/rocket.png\",\n      \"description\": \"Super awesome controll panel.\",\n      \"name\": \"SpaceCP\",\n      \"__v\": 0,\n      \"scopes\": [\n        \"mailbox.create\",\n        \"user.list\"\n      ]\n    },\n    {\n      ...\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>Invalid parameters.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Invalid parameters.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/client.js",
    "groupTitle": "Clients",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p> "
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "D__Projects_MailJS_http_doc_main_js",
    "groupTitle": "D__Projects_MailJS_http_doc_main_js",
    "name": ""
  },
  {
    "type": "get",
    "url": "/domain",
    "title": "Get domains",
    "version": "0.1.0",
    "name": "GetDomains",
    "group": "Domain",
    "description": "<p>Get all domains openly avalible</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "domains",
            "description": "<p>A list of domains.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"domains\": [\n    {\n      \"_id\": \"55e40dc8cf8dbadb0c352305\",\n      \"domain\": \"example.com\",\n      \"disabled\": \"false\",\n      \"__v\": 0\n    },\n    {\n      ....\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/domain.js",
    "groupTitle": "Domain",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/domain",
    "title": "Create domain",
    "version": "0.1.0",
    "name": "PostDomain",
    "group": "Domain",
    "permission": [
      {
        "name": "domain.create"
      }
    ],
    "description": "<p>Create a new domain.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "domain",
            "description": "<p>Domain to be registerd (e.g. <code>example.com</code>)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "disabled",
            "description": "<p>(optional) Disable the domain for registrations, default to false</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Create a new disabled domain:",
          "content": "{\n  \"domain\": \"mailjs.net\",\n  \"disabled\": \"true\"\n}",
          "type": "json"
        },
        {
          "title": "Create a new enabled domain:",
          "content": "{\n  \"domain\": \"mailjs.net\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>The new user.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  {\n    \"domain\": {\n      \"__v\": 0,\n      \"domain\": \"mailjs.net\",\n      \"disabled\": \"true\",\n      \"_id\": \"55e415b46e0c093119a0748c\",\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>Domain missing</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Domain missing.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Invalid disabled value.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/domain.js",
    "groupTitle": "Domain",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/group/:groupid",
    "title": "Get a specific group",
    "version": "0.1.0",
    "name": "GetGroup",
    "group": "Group",
    "description": "<p>Get a specific group by group id.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "groupid",
            "description": "<p>ID of the group to get.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "group",
            "description": "<p>The group requested</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"group\": {\n    \"_id\": \"55e17a65989d3fcc096c3efb\",\n    \"type\": \"Administrators\",\n    \"name\": \"Administrators\",\n    \"__v\": 0,\n    \"permissions\": [\n      \"user.list\",\n      \"user.create\",\n      \"user.delete\",\n      \"user.protected\",\n      \"user.overwrite\",\n      \"user.group.change\",\n      \"client.create\",\n      \"client.list\",\n      \"client.delete\",\n      \"mailbox.create\",\n      \"domain.create\"\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>The given group ID is not in the correct format.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>The given group was not found.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Invalid group ID!\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "ENOTFOUND:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"ENOTFOUND\",\n    \"message\": \"Group not found.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/group.js",
    "groupTitle": "Group",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/group",
    "title": "Get all groups",
    "version": "0.1.0",
    "name": "GetGroups",
    "group": "Group",
    "permission": [
      {
        "name": "group.list"
      }
    ],
    "description": "<p>Get all groups available</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "groups",
            "description": "<p>A list of group objects available.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"groups\": [\n    {\n      \"_id\": \"55e17a65989d3fcc096c3efb\",\n      \"type\": \"Administrators\",\n      \"name\": \"Administrators\",\n      \"__v\": 0,\n      \"permissions\": [\n        \"user.list\",\n        \"user.create\",\n        \"user.delete\",\n        \"user.protected\",\n        \"user.overwrite\",\n        \"user.group.change\",\n        \"client.create\",\n        \"client.list\",\n        \"client.delete\",\n        \"mailbox.create\",\n        \"domain.create\"\n      ]\n    },\n    {\n      ....\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/group.js",
    "groupTitle": "Group",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "patch",
    "url": "/login",
    "title": "2FA Login",
    "version": "0.1.0",
    "name": "2faLoginUser",
    "group": "Login",
    "description": "<p>Log in to the user account if 2fa is needed. need to have a token already which still needs 2fa auth.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "code",
            "description": "<p>TOTP code got from the 2fa authenticator</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Login to a user:",
          "content": "{\n  \"code\": \"219832\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "success",
            "description": "<p>Success bool.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": \"true\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>TOTP value invalid.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EDONE",
            "description": "<p>User already authenticated.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"TOTP value invalid.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EDONE:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"User already authenticated.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/login.js",
    "groupTitle": "Login"
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login",
    "version": "0.1.0",
    "name": "LoginUser",
    "group": "Login",
    "description": "<p>Login on a user account, it returns a token which is valid for 24 hours.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Password which belongs to the username.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Login to a user:",
          "content": "{\n  \"username\": \"AtlasDev\",\n  \"password\": \"supersecretpassword\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "token",
            "description": "<p>The auth token of the user, uses for futher auth.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>User object of the user logged in.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "need2FA",
            "description": "<p>If the user needs to authenticate with 2FA after login</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "2FAuri",
            "description": "<p>URI of the 2FA login, only exists if need2FA = true</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"0TXlLAtzDPSIwiWQ93VnFMB5UHkbCUTTv43JICXXSEmxtqhJTiPVPosZidvpxshh\",\n  \"need2FA\": \"true\",\n  \"2FAuri\": \"/api/v1/2fa/setup\",\n  \"user\": {\n    \"_id\": \"55e06be7650cf63410cdf8ad\",\n    \"username\": \"admin\",\n    \"group\": \"55e06be7650cf63410cdf8aa\",\n    \"__v\": 0,\n    \"mailboxes\": [\n      \"55e06be7650cf63410cdf8af\"\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The username/password is invalid.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/login.js",
    "groupTitle": "Login"
  },
  {
    "type": "delete",
    "url": "/login",
    "title": "Logout",
    "version": "0.1.0",
    "name": "LogoutUser",
    "group": "Login",
    "description": "<p>Logout the current logged in user.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>Simple success message.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Logout successfull.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/login.js",
    "groupTitle": "Login",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "patch",
    "url": "/mailbox",
    "title": "Claim mailbox",
    "version": "0.1.0",
    "name": "ClaimMailbox",
    "group": "Mailbox",
    "description": "<p>Claim an existing mailbox with an transfer code.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "transfercode",
            "description": "<p>Transfer code gain from an existing admin.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Claim mailbox:",
          "content": "{\n  \"transfercode\": \"2fHq5afM\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "mailbox",
            "description": "<p>The claimed mailbox.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  {\n    \"mailbox\": {\n      \"__v\": 0,\n      \"transferCode\": \"hqYqUPs9ce\",\n      \"smtpToken\": \"afr6UPs9ce\",\n      \"domain\": \"5606e7f49ba75d600a11bc5b\",\n      \"address\": \"myname@example.com\",\n      \"_id\": \"5606e83d33753cc40c80f8d8\",\n      \"transferable\": false,\n      \"admins\": [\n        \"5606e7f49ba75d600a11bc5a\"\n      ],\n      \"owner\": \"5606e7f49ba75d600a11bc5a\"\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EMISSING",
            "description": "<p>Request data is missing.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>Mailbox not found</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EDENIED",
            "description": "<p>Mailbox not transferable</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EOCCUPIED",
            "description": "<p>User already member of the mailbox</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EMISSING:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EMISSING\",\n    \"message\": \"Request data is missing.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"ENOTFOUND\",\n    \"message\": \"Mailbox not found.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EDENIED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EDENIED\",\n    \"message\": \"Mailbox not transferable.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EDENIED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EOCCUPIED\",\n    \"message\": \"User already member of the mailbox.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/mailbox.js",
    "groupTitle": "Mailbox",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/mailbox/:mailbox",
    "title": "Get a specific mailbox",
    "version": "0.1.0",
    "name": "GetMailbox",
    "group": "Mailbox",
    "permission": [
      {
        "name": "mailbox.view"
      }
    ],
    "description": "<p>Get information about a mailbox. Permissions only needed when mailbox is not owned.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "mailbox",
            "description": "<p>The mailbox ID to find the information about.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Find a user by username:",
          "content": ".../mailbox/5606e7f49ba75d600a11bc5b",
          "type": "url"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "mailbox",
            "description": "<p>The mailbox information.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  {\n    \"mailbox\": {\n      \"__v\": 0,\n      \"transferCode\": \"hqYqUPs9ce\",\n      \"smtpToken\": \"afr6UPs9ce\",\n      \"domain\": \"5606e7f49ba75d600a11bc5b\",\n      \"address\": \"myname@example.com\",\n      \"_id\": \"5606e83d33753cc40c80f8d8\",\n      \"transferable\": false,\n      \"admins\": [\n        \"5606e7f49ba75d600a11bc5a\"\n      ],\n      \"owner\": \"5606e7f49ba75d600a11bc5a\"\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>Invalid mailbox ID.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>Could not find mailbox.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Invalid mailbox ID.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 404 Not found\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Could not find mailbox.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/mailbox.js",
    "groupTitle": "Mailbox",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/mailbox",
    "title": "Get mailboxes of a user",
    "version": "0.1.0",
    "name": "GetMailboxes",
    "group": "Mailbox",
    "description": "<p>Get the mailboxes the user has access to.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "mailboxes",
            "description": "<p>A list of mailboxes.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"mailboxes\": [\n    {\n      \"_id\": \"55e40dc8cf8dbadb0c352305\",\n      \"username\": \"admin\",\n      \"group\": \"55e40dc8cf8dbadb0c352302\",\n      \"firstName\": \"Admin\",\n      \"lastName\": \"Adminius\",\n      \"__v\": 0,\n      \"mailboxes\": [\n        \"55e40dc8cf8dbadb0c352307\"\n      ]\n    },\n    {\n      ....\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>User has no mailboxes.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"ENOTFOUND\",\n    \"message\": \"User has no mailboxes.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/mailbox.js",
    "groupTitle": "Mailbox",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/mailbox",
    "title": "Create mailbox",
    "version": "0.1.0",
    "name": "PostMailbox",
    "group": "Mailbox",
    "permission": [
      {
        "name": "mailbox.create"
      }
    ],
    "description": "<p>Create a new mailbox with the specified data.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "local",
            "description": "<p>Local part of the address, like <code>myname</code> for myname@example.com (domain is example.com)</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "domain",
            "description": "<p>Domain ID of the domain of the to be created domain.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Boolean</p> ",
            "optional": false,
            "field": "transferable",
            "description": "<p>(Optional) If the mailbox is transferable with a token (default to false).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Create a new user:",
          "content": "{\n  \"local\": \"myname\",\n  \"domain\": \"55e40dc8cf8dbadb0c352302\",\n  \"transferable\": \"true\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "mailbox",
            "description": "<p>The new mailbox.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  {\n    \"mailbox\": {\n      \"__v\": 0,\n      \"transferCode\": \"hqYqUPs9ce\",\n      \"smtpToken\": \"afr6UPs9ce\",\n      \"domain\": \"5606e7f49ba75d600a11bc5b\",\n      \"address\": \"myname@example.com\",\n      \"_id\": \"5606e83d33753cc40c80f8d8\",\n      \"transferable\": false,\n      \"admins\": [\n        \"5606e7f49ba75d600a11bc5a\"\n      ],\n      \"owner\": \"5606e7f49ba75d600a11bc5a\"\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>Request data is missing.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Request data is missing.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Transferable data is invalid.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/mailbox.js",
    "groupTitle": "Mailbox",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/user/session",
    "title": "Get active sessions",
    "version": "0.1.0",
    "name": "GetSession",
    "group": "Sessions",
    "description": "<p>Get all active session of the current logged in user.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "session",
            "description": "<p>A list of sessions.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"session\": [\n    {\n      \"_id\": \"55e40dc8cf8dbadb0c352305\",\n      \"username\": \"admin\",\n      \"group\": \"55e40dc8cf8dbadb0c352302\",\n      \"firstName\": \"Admin\",\n      \"lastName\": \"Adminius\",\n      \"__v\": 0,\n      \"mailboxes\": [\n        \"55e40dc8cf8dbadb0c352307\"\n      ]\n    },\n    {\n      ....\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/session.js",
    "groupTitle": "Sessions",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/user/current",
    "title": "Get current user",
    "version": "0.1.0",
    "name": "GetCurrentUser",
    "group": "User",
    "description": "<p>Get the user current logged in with the session key.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>The user found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  {\n    \"user\": {\n      \"__v\": 0,\n      \"username\": \"AtlasDev\",\n      \"group\": \"55e40dc8cf8dbadb0c352304\",\n      \"firstName\": \"Dany\",\n      \"lastName\": \"Sluijk\",\n      \"_id\": \"55e415b46e0c093119a0748c\",\n      \"mailboxes\": []\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/user.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/user/:user",
    "title": "Get a specific user",
    "version": "0.1.0",
    "name": "GetUser",
    "group": "User",
    "permission": [
      {
        "name": "user.list"
      }
    ],
    "description": "<p>Get a specific user by ID or username.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "getBy",
            "description": "<p>whenether you get a user by ID or username. Throws error if specified but not <code>username</code> or <code>ID</code>. default to <code>ID</code>.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>The ID or username to search by.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Find a user by username:",
          "content": "?getBy=AtlasDev",
          "type": "url"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>The user found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  {\n    \"user\": {\n      \"__v\": 0,\n      \"username\": \"AtlasDev\",\n      \"group\": \"55e40dc8cf8dbadb0c352304\",\n      \"firstName\": \"Dany\",\n      \"lastName\": \"Sluijk\",\n      \"_id\": \"55e415b46e0c093119a0748c\",\n      \"mailboxes\": []\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>Invalid getBy parameter.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>Could not find user.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Invalid getBy parameter.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 404 Not found\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Could not find user.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Invalid user ID\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/user.js",
    "groupTitle": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/user",
    "title": "Get users",
    "version": "0.1.0",
    "name": "GetUsers",
    "group": "User",
    "permission": [
      {
        "name": "user.list"
      }
    ],
    "description": "<p>Get a list of users.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Int</p> ",
            "optional": false,
            "field": "limitBy",
            "description": "<p>(optional) Limit the amount of users to give back. should be as low as possible.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Int</p> ",
            "optional": false,
            "field": "skip",
            "description": "<p>(optional) Skip an amount of users, usefull for pagination and such.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Create a new user:",
          "content": "?limitBy=20&skip=20",
          "type": "url"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "users",
            "description": "<p>A list of users.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"users\": [\n    {\n      \"_id\": \"55e40dc8cf8dbadb0c352305\",\n      \"username\": \"admin\",\n      \"group\": \"55e40dc8cf8dbadb0c352302\",\n      \"firstName\": \"Admin\",\n      \"lastName\": \"Adminius\",\n      \"__v\": 0,\n      \"mailboxes\": [\n        \"55e40dc8cf8dbadb0c352307\"\n      ]\n    },\n    {\n      ....\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>LimitBy should be a number.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"LimitBy should be a number.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Skip should be a number.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/user.js",
    "groupTitle": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/user",
    "title": "Create user",
    "version": "0.1.0",
    "name": "PostUser",
    "group": "User",
    "permission": [
      {
        "name": "user.create"
      }
    ],
    "description": "<p>Create a new user with the specified data.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>Desired username of the user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Desired password of the user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "firstName",
            "description": "<p>Firstname of the new user.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "lastName",
            "description": "<p>Lastname of the new user.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Create a new user:",
          "content": "{\n  \"username\": \"AtlasDev\",\n  \"password\": \"supersecretpassword\",\n  \"firstName\": \"Dany\",\n  \"lastName\": \"Sluijk\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>The new user.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  {\n    \"message\": \"User added!\",\n    \"data\": {\n      \"__v\": 0,\n      \"username\": \"AtlasDev\",\n      \"group\": \"55e40dc8cf8dbadb0c352304\",\n      \"firstName\": \"Dany\",\n      \"lastName\": \"Sluijk\",\n      \"_id\": \"55e415b46e0c093119a0748c\",\n      \"mailboxes\": []\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>Request data is missing.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMS",
            "description": "<p>The permission level of the user is not high enough.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>The user is not authorized.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Request data is missing.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMS:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"error\": {\n    \"name\": \"EPERM\",\n    \"message\": \"Permission denied.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\nUnauthorized",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/user.js",
    "groupTitle": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-token",
            "description": "<p>User session token</p> "
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>OAuth access token.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Session Header:",
          "content": "\"x-token\": \"{token}\"",
          "type": "String"
        },
        {
          "title": "OAuth Header:",
          "content": "\"Authorization\": \"Bearer {token}\"",
          "type": "String"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/oauth/authorize",
    "title": "Request for authorization",
    "version": "0.1.0",
    "name": "getAuthorize",
    "group": "oauth",
    "description": "<p>Request authorization from a client to the account of a user</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "client_id",
            "description": "<p>The id of the client requesting access.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "response_type",
            "description": "<p>Response type, should always be code.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "redirect_uri",
            "description": "<p>Redirect uri where the code will be send to after the user has accepted the request.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "authorize an client with the id `55bcf8a904edc314212c857d`:",
          "content": "/api/oauth2/authorize?client_id=55bcf8a904edc314212c857d&response_type=code&redirect_uri=http://localhost",
          "type": "url"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>html</p> ",
            "optional": false,
            "field": "html",
            "description": "<p>The dialoge page with the request for permissions</p> "
          }
        ]
      }
    },
    "filename": "./docfiles/old/oauth.js",
    "groupTitle": "oauth"
  },
  {
    "type": "POST",
    "url": "/oauth/token",
    "title": "Exchange code",
    "version": "0.1.0",
    "name": "postToken",
    "group": "oauth",
    "description": "<p>Exchange a code for a bearer access token.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Sting</p> ",
            "optional": false,
            "field": "code",
            "description": "<p>The code gain from the callback (see /oauth/authorize).</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "response_type",
            "description": "<p>Response type, should always be code.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "redirect_uri",
            "description": "<p>The redirect url which was used in GET /oauth/authorize, used as validation</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Exchange a code for a token:",
          "content": "{\n  \"code\": \"Aq4XW8Fleb\",\n  \"response_type\": \"code\",\n  \"redirect_uri\": \"http://localhost\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "mailboxes",
            "description": "<p>The mailboxes the user has access to.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "group",
            "description": "<p>The number of the users group (1=user 2=mod 3=admin)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Created response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"55bcf8a904edc314212c857d\",\n  \"username\": \"AtlasDev\",\n  \"mailboxes\": [],\n  \"group\": 1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./docfiles/old/oauth.js",
    "groupTitle": "oauth"
  }
] });