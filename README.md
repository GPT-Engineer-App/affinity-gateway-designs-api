# affinity-gateway-designs-api

{
  "swagger": "2.0",
  "info": {
    "description": "External API for the Affinity Gateway",
    "version": "1.0.0",
    "title": "Affinity Consultants API",
    "contact": {
      "email": "tech@affinity-consultants.com"
    },
    "license": {
      "name": "Proprietary"
    }
  },
  "host": "api.affinitygateway.com",
  "tags": [
    {
      "name": "designs",
      "description": "Product design operations"
    }
  ],
  "schemes": [
    "https"
  ],
  "paths": {
    "/product_categories": {
      "get": {
        "tags": [
          "designs"
        ],
        "summary": "List product categories",
        "operationId": "listCategories",
        "description": "List existing product categories\n",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "is_available",
            "in": "query",
            "type": "boolean",
            "required": false,
            "default": false,
            "description": "When set, only returns product categories which you have previously\nadded to a license application.\nYou should only upload designs within this subset.\n"
          }
        ],
        "responses": {
          "200": {
            "description": "list of product categories",
            "schema": {
              "$ref": "#/definitions/CategoriesResponse"
            }
          },
          "401": {
            "description": "not authenticated"
          },
          "403": {
            "description": "not authorized"
          }
        }
      }
    },
    "/clients": {
      "get": {
        "tags": [
          "designs"
        ],
        "summary": "List licensed organizations",
        "operationId": "listOrganizations",
        "description": "List existing licensed organizations\n",
        "produces": [
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "list of organizations",
            "schema": {
              "$ref": "#/definitions/OrganizationsResponse"
            }
          },
          "401": {
            "description": "not authenticated"
          },
          "403": {
            "description": "not authorized"
          }
        }
      }
    },
    "/designs": {
      "get": {
        "tags": [
          "designs"
        ],
        "summary": "List product designs",
        "operationId": "listDesigns",
        "description": "List existing designs\n",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "page_size",
            "in": "query",
            "type": "integer",
            "required": false,
            "description": "Maximum number of results to return in response, 1<=n<=100"
          },
          {
            "name": "page",
            "in": "query",
            "type": "integer",
            "required": false,
            "description": "1-based page number of result set"
          }
        ],
        "responses": {
          "200": {
            "description": "search results matching criteria",
            "schema": {
              "$ref": "#/definitions/DesignsResponse"
            }
          },
          "400": {
            "description": "bad input parameter"
          }
        }
      },
      "post": {
        "tags": [
          "designs"
        ],
        "summary": "Upload a new design",
        "operationId": "addDesign",
        "description": "Adds a new design to the system",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Request body for design submission",
            "schema": {
              "$ref": "#/definitions/CreateDesignRequest"
            }
          }
        ],
        "responses": {
          "201": {
            "description": "item created"
          },
          "400": {
            "description": "invalid input, object invalid"
          }
        }
      }
    },
    "/designs/{designId}": {
      "get": {
        "tags": [
          "designs"
        ],
        "summary": "Get design by ID",
        "description": "Returns a single design",
        "operationId": "getDesignById",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "designId",
            "in": "path",
            "description": "ID of design to return",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Design with the given ID",
            "schema": {
              "$ref": "#/definitions/Design"
            }
          },
          "401": {
            "description": "Authentication required"
          },
          "403": {
            "description": "Unauthorized to delete design"
          },
          "404": {
            "description": "Design not found"
          }
        }
      },
      "delete": {
        "tags": [
          "designs"
        ],
        "summary": "Delete a design",
        "description": "Designs may only be deleted if they have not yet been reviewed.\nMaking this request against a design that cannot not be deleted\nwill result in an HTTP 403 response.\n",
        "operationId": "deleteDesignById",
        "consumes": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "designId",
            "in": "path",
            "description": "Design ID to delete",
            "required": true,
            "type": "integer",
            "format": "int32"
          }
        ],
        "responses": {
          "200": {
            "description": "Design deleted"
          },
          "401": {
            "description": "Authentication required"
          },
          "403": {
            "description": "Unauthorized to delete design"
          },
          "404": {
            "description": "Design not found"
          }
        }
      }
    },
    "/designs/{designId}/iterations": {
      "post": {
        "tags": [
          "designs"
        ],
        "summary": "Submit a new image to a design",
        "description": "Submits a new image as a new \"version\"/\"iteration\" on an existing design\n",
        "operationId": "resubmitDesignById",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "designId",
            "in": "path",
            "description": "Design ID to resubmit to",
            "required": true,
            "type": "integer",
            "format": "int32"
          },
          {
            "name": "body",
            "in": "body",
            "description": "Request body for design resubmission",
            "schema": {
              "$ref": "#/definitions/ResubmitDesignRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Design after resubmission",
            "schema": {
              "$ref": "#/definitions/Design"
            }
          },
          "401": {
            "description": "Authentication required"
          },
          "403": {
            "description": "Unauthorized to delete design"
          },
          "404": {
            "description": "Design not found"
          }
        }
      }
    }
  },
  "definitions": {
    "CategoriesResponse": {
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ProductCategory"
          }
        }
      }
    },
    "OrganizationsResponse": {
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Organization"
          }
        }
      }
    },
    "DesignsResponse": {
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Design"
          }
        }
      }
    },
    "Organization": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int32",
          "readOnly": true,
          "example": 15618
        },
        "name": {
          "type": "string",
          "example": "Phi Kappa Theta Fraternity"
        },
        "short_name": {
          "type": "string",
          "example": "Phi Kappa Theta"
        }
      }
    },
    "ProductCategory": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int32",
          "readOnly": true,
          "example": 1
        },
        "name": {
          "type": "string",
          "example": "Pin-back buttons"
        }
      }
    },
    "CreateDesignRequest": {
      "type": "object",
      "description": "Request body for design upload\n",
      "required": [
        "title",
        "product_category_id",
        "image",
        "image_filename",
        "primary_client_id"
      ],
      "properties": {
        "title": {
          "type": "string",
          "example": "My Shirt",
          "description": "Title of the design"
        },
        "internal_code": {
          "type": "string",
          "example": "design_001",
          "description": "Optional identifier used internally within your system"
        },
        "product_category_id": {
          "type": "integer",
          "format": "int32",
          "example": 156
        },
        "image": {
          "type": "string",
          "format": "byte",
          "description": "Base64-encoded string of image data"
        },
        "image_filename": {
          "type": "string",
          "description": "Filename of image",
          "example": "designco_01.png"
        },
        "description": {
          "type": "string",
          "description": "Text description of design notes/etc to pass on to reviewers",
          "example": "This is a v-neck t-shirt"
        },
        "primary_client_id": {
          "type": "integer",
          "format": "int32",
          "example": 1007,
          "description": "Organization ID to which this design belongs"
        },
        "is_expedited": {
          "type": "boolean",
          "example": true,
          "description": "Set to true to request the design be expedited. Requires that your account\nis configured to allow expedited designs. You will be charged for a\nsuccessfully expedited design.\n"
        }
      }
    },
    "ResubmitDesignRequest": {
      "type": "object",
      "description": "Request body for design resubmission\n",
      "required": [
        "image",
        "image_filename"
      ],
      "properties": {
        "image": {
          "type": "string",
          "format": "byte",
          "description": "Base64-encoded string of image data"
        },
        "image_filename": {
          "type": "string",
          "description": "Filename of image",
          "example": "designco_01.png"
        }
      }
    },
    "Design": {
      "type": "object",
      "description": "Product design\n",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int32",
          "readOnly": true,
          "example": 12345
        },
        "created_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "updated_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "deleted_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "expedited_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "decision_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "title": {
          "type": "string",
          "example": "My Design"
        },
        "gateway_url": {
          "type": "string",
          "example": "https://affinity-gateway.com/designs/1234"
        },
        "description": {
          "type": "string",
          "example": "This design is on a shirt."
        },
        "internal_code": {
          "type": "string",
          "example": "design_001"
        },
        "is_autotagged_client": {
          "type": "boolean",
          "example": true
        },
        "phase": {
          "$ref": "#/definitions/DesignPhase"
        },
        "vendor": {
          "$ref": "#/definitions/Vendor",
          "readOnly": true
        },
        "product_category": {
          "$ref": "#/definitions/DesignProductCategory"
        },
        "clients": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/DesignClient"
          }
        },
        "primary_client": {
          "$ref": "#/definitions/DesignClient"
        },
        "secondary_clients": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/DesignClient"
          }
        },
        "iterations": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/DesignIteration"
          }
        },
        "product_category_id": {
          "type": "integer",
          "format": "int32",
          "example": 3
        },
        "eligible_phase_transitions": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/DesignPhaseTransition"
          }
        }
      }
    },
    "DesignPhase": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int32",
          "readOnly": true,
          "example": 14
        },
        "name": {
          "type": "string",
          "readOnly": true,
          "example": "Approved By Admin"
        },
        "short_name": {
          "type": "string",
          "readOnly": true,
          "example": "Admin"
        },
        "banner_class": {
          "type": "string",
          "readOnly": true,
          "example": "banner-approved-a"
        }
      }
    },
    "DesignPhaseTransition": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int32",
          "readOnly": true,
          "example": 1
        },
        "default_message": {
          "type": "string",
          "readOnly": true,
          "example": "This design is on hold"
        },
        "roles": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "DesignProductCategory": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int32",
          "readOnly": true,
          "example": 1
        },
        "name": {
          "type": "string",
          "example": "Pin-back buttons"
        }
      }
    },
    "DesignClient": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int32",
          "readOnly": true,
          "example": 1007
        },
        "created_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "updated_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "deleted_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "name": {
          "type": "string",
          "example": "Alpha Chi Omega"
        },
        "short_name": {
          "type": "string",
          "example": "Alpha Chi Omega"
        }
      }
    },
    "DesignIteration": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int32",
          "readOnly": true,
          "example": 1
        },
        "created_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "updated_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "deleted_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "decision_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "phase": {
          "$ref": "#/definitions/DesignPhase"
        },
        "image": {
          "$ref": "#/definitions/DesignImage"
        }
      }
    },
    "DesignImage": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int32",
          "readOnly": true,
          "example": 1
        },
        "previous_file_name": {
          "type": "string",
          "example": "tribal pattern-alpha chi omega.jpg"
        },
        "urls": {
          "$ref": "#/definitions/DesignImageUrls"
        }
      }
    },
    "DesignImageUrls": {
      "type": "object",
      "properties": {
        "th": {
          "type": "string",
          "example": "http://example.com/th.jpg"
        },
        "sm": {
          "type": "string",
          "example": "http://example.com/sm.jpg"
        },
        "md": {
          "type": "string",
          "example": "http://example.com/md.jpg"
        },
        "or": {
          "type": "string",
          "example": "http://example.com/or.jpg"
        }
      }
    },
    "Vendor": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int32",
          "readOnly": true,
          "example": 1
        },
        "created_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "updated_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "deleted_at": {
          "type": "string",
          "format": "date-time",
          "readOnly": true
        },
        "name": {
          "type": "string",
          "example": "AB Designs"
        }
      }
    }
  },
  "securityDefinitions": {
    "APIKeyHeader": {
      "type": "apiKey",
      "in": "header",
      "name": "X-Api-Key"
    }
  }
}


## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/affinity-gateway-designs-api.git
cd affinity-gateway-designs-api
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Tech stack

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Chakra UI](https://chakra-ui.com/)

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
