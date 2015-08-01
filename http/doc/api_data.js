define({ "api": [
  {
    "type": "post",
    "url": "/client",
    "title": "Create a new client",
    "version": "0.1.0",
    "name": "CreateClient",
    "group": "Client",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>Create a new cliet.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the application the client is created for.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Create client:",
          "content": "{\n  \"name\": \"SpaceCP\"\n}",
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
            "field": "Message",
            "description": "<p>A message of success.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "data",
            "description": "<p>The client object created.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Client added!\",\n  \"data\": {\n    \"__v\": 0,\n    \"userId\": \"55bcfd439fc60f902808da36\",\n    \"secret\": \"$2a$05$jjU7Tx7ssFGMs0Zp7TjVGOfG9kilWgUb8atQ7yikp2Mjl7w/nUX3O\",\n    \"id\": \"$2a$05$aP6QNevEHPfQYDL1tNeYqOKHyTfkfOXXfwKvbKYzWa8mGXST3wXrO\",\n    \"name\": \"MailTest\",\n    \"_id\": \"55bcffbc6aeb0af00ad0cfe8\"\n  }\n }",
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
            "description": "<p>Username/Password is not valid.</p> "
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
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"name/id/secret not filled in.\"\n  }\n}",
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
    "filename": "./_apidoc.js",
    "groupTitle": "Client"
  },
  {
    "type": "delete",
    "url": "/client",
    "title": "Delete a client",
    "version": "0.1.0",
    "name": "DeleteClient",
    "group": "Client",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>Delete a client.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the client to be deleted. (found by a GET request, it's the _id property).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Successfull request:",
          "content": "{\n  \"id\": \"55bcfe016aeb0af00ad0cfe4\"\n}",
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
            "description": "<p>A message of success.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"Client deleted.\"\n}",
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
            "description": "<p>ID was not given.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>given id was not found.</p> "
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
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"No id given.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "ENOTFOUND:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"ENOTFOUND\",\n    \"message\": \"The given id was not found.\"\n  }\n}",
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
    "filename": "./_apidoc.js",
    "groupTitle": "Client"
  },
  {
    "type": "get",
    "url": "/client",
    "title": "Get all clients",
    "version": "0.1.0",
    "name": "GetClients",
    "group": "Client",
    "permission": [
      {
        "name": "Mod"
      }
    ],
    "description": "<p>Gives back a list of clients registered with there properties.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "users",
            "description": "<p>All client objects registered.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\": \"55bcfd686aeb0af00ad0cfe3\",\n    \"userId\": \"55bcfd439fc60f902808da36\",\n    \"secret\": \"$2a$05$mRs66hZOQnygrJfGBvKk8Oij.J67hFdJj7aMOnnyYzp/3HQv0Gm/e\",\n    \"id\": \"$2a$05$kjRgAKvF/n00ZmaukIoFSe/r2ZYCcHMTmdutJJiNx67PINogxU4Im\",\n    \"name\": \"mail\",\n    \"__v\": 0\n  },\n  {\n    \"_id\": \"55bcfe016aeb0af00ad0cfe4\",\n    \"userId\": \"55bcfd439fc60f902808da36\",\n    \"secret\": \"$2a$05$Sw6Ep1SLE7X881ZLjrOezOGg.U5QOnuzU/x6NWwxFSlHHZYqQK8Ji\",\n    \"id\": \"$2a$05$dQca6PfE4eVS6vTvg/h0ZOZlEp5H6Qt7no8hqgAxUoy7wNS3Z6VVK\",\n    \"name\": \"SpaceCP\",\n    \"__v\": 0\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "./_apidoc.js",
    "groupTitle": "Client",
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
    }
  },
  {
    "version": "0.1.0",
    "type": "",
    "url": "",
    "filename": "./_apidoc.js",
    "group": "D__Projects_Git_Clones_MailJS_http__apidoc_js",
    "groupTitle": "D__Projects_Git_Clones_MailJS_http__apidoc_js",
    "name": ""
  },
  {
    "version": "0.1.0",
    "type": "",
    "url": "",
    "filename": "./_apidoc.js",
    "group": "D__Projects_Git_Clones_MailJS_http__apidoc_js",
    "groupTitle": "D__Projects_Git_Clones_MailJS_http__apidoc_js",
    "name": ""
  },
  {
    "version": "0.1.0",
    "type": "",
    "url": "",
    "filename": "./_apidoc.js",
    "group": "D__Projects_Git_Clones_MailJS_http__apidoc_js",
    "groupTitle": "D__Projects_Git_Clones_MailJS_http__apidoc_js",
    "name": ""
  },
  {
    "type": "post",
    "url": "/user",
    "title": "Create a new User",
    "version": "0.1.0",
    "name": "CreateUser",
    "group": "User",
    "permission": [
      {
        "name": "Mod"
      }
    ],
    "description": "<p>Create a new user.</p> ",
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
          }
        ]
      },
      "examples": [
        {
          "title": "Create a new user:",
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
            "field": "_id",
            "description": "<p>The id of the user.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the user.</p> "
          },
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
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EINVALID",
            "description": "<p>Username/Password is not valid.</p> "
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
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Username/Password is not valid.\"\n  }\n}",
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
    "filename": "./_apidoc.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/user",
    "title": "Delete a user",
    "version": "0.1.0",
    "name": "DeleteUser",
    "group": "User",
    "permission": [
      {
        "name": "Mod"
      }
    ],
    "description": "<p>Delete a user.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user to be deleted (found by a GET request, it's the _id property).</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Successfull request:",
          "content": "{\n  \"id\": \"55bcf8a904edc314212c857d\"\n}",
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
            "description": "<p>A message of success.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"User deleted.\"\n}",
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
            "description": "<p>ID was not given.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>given id was not found.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMITTED",
            "description": "<p>You cannot delete yourself.</p> "
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
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"No id given.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "ENOTFOUND:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"ENOTFOUND\",\n    \"message\": \"The given id was not found.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMITTED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EPERMITTED\",\n    \"message\": \"You cannot delete yourself.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMITTED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EPERMITTED\",\n    \"message\": \"You cannot delete the first user.\"\n  }\n}",
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
    "filename": "./_apidoc.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user",
    "title": "Get all users",
    "version": "0.1.0",
    "name": "GetUsers",
    "group": "User",
    "permission": [
      {
        "name": "Mod"
      }
    ],
    "description": "<p>Gives back a list of users registered with there properties.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Array</p> ",
            "optional": false,
            "field": "users",
            "description": "<p>All user objects registered.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Get all users:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"_id\": \"55bcf88eaa9f7e8c217ee376\",\n    \"username\": \"admin\",\n    \"mailboxes\": [],\n    \"group\": 3\n  },\n  {\n    \"_id\": \"55bcf8a904edc314212c857d\",\n    \"username\": \"AtlasDev\",\n    \"mailboxes\": [],\n    \"group\": 1\n  }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "./_apidoc.js",
    "groupTitle": "User",
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
    }
  },
  {
    "type": "put",
    "url": "/user/group",
    "title": "Update the group of a user",
    "version": "0.1.0",
    "name": "UpdateUserGroup",
    "group": "User",
    "permission": [
      {
        "name": "Admin"
      }
    ],
    "description": "<p>Update the group of a user.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>The id of the user</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "group",
            "description": "<p>The id of the new group (1=User 2=Mod 3=Admin)</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Successfull request:",
          "content": "{\n  \"id\": \"55bcf8a904edc314212c857d\",\n  \"group\": \"2\"\n}",
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
            "description": "<p>A message of success.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"message\": \"User group updated.\"\n}",
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
            "description": "<p>ID or group was not given.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ENOTFOUND",
            "description": "<p>given id was not found.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "EPERMITTED",
            "description": "<p>You cannot change your own group.</p> "
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
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"No id/group given.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EINVALID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EINVALID\",\n    \"message\": \"Group not valid\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "ENOTFOUND:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"ENOTFOUND\",\n    \"message\": \"The given id was not found.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMITTED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EPERMITTED\",\n    \"message\": \"You cannot change your own group.\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "EPERMITTED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": {\n    \"name\": \"EPERMITTED\",\n    \"message\": \"You cannot the group of the first user.\"\n  }\n}",
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
    "filename": "./_apidoc.js",
    "groupTitle": "User"
  }
] });