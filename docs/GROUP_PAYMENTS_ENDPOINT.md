# Endpoint de Pagos por Grupo - Documentación Frontend

## 📋 Descripción

Endpoint optimizado que devuelve **TODOS los pagos de un grupo** con información completa del evento, miembro que pagó y miembro del cumpleaños. Este endpoint reduce significativamente el número de peticiones necesarias desde el frontend.

---

## 🎯 Endpoint

### **GET** `/api/groups/:groupId/payments`

Obtiene todos los pagos realizados en un grupo con información completa.

---

## 🔐 Autenticación

**Requerida:** Sí

**Header:**
```
Authorization: Bearer <token>
```

---

## 📥 Request

### **URL Parameters**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `groupId` | `number` | ✅ Sí | ID del grupo |

### **Ejemplo de Request**

```bash
GET /api/groups/45/payments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📤 Response

### **Success Response (200 OK)**

```typescript
{
  message: string;
  groupId: number;
  groupName: string;
  totalPayments: number;
  totalPaid: number;
  payments: GroupPaymentResponse[];
}
```

### **Estructura de `GroupPaymentResponse`**

```typescript
interface GroupPaymentResponse {
  // Información del pago
  id: number;
  birthdayEventId: number;
  memberId: number;
  amount: number;
  datePaid: string; // "YYYY-MM-DD"
  proofUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Información del miembro que pagó
  member?: {
    id: number;
    groupId: number;
    name: string;
    phone?: string;
    birthday: string; // "YYYY-MM-DD"
    photoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  // Información del evento de cumpleaños
  event: {
    id: number;
    birthdayDate: string; // "YYYY-MM-DD"
    expectedAmount: number;
    memberId: number; // ID del miembro que cumple años
    memberName: string; // Nombre del miembro que cumple años
  };
}
```

### **Ejemplo de Response Exitosa**

```json
{
  "message": "Pagos del grupo obtenidos exitosamente",
  "groupId": 45,
  "groupName": "Familia Mercado Sánchez",
  "totalPayments": 3,
  "totalPaid": 900,
  "payments": [
    {
      "id": 84,
      "birthdayEventId": 121,
      "memberId": 130,
      "amount": 500,
      "datePaid": "2025-12-15",
      "createdAt": "2025-12-15T04:36:44.740Z",
      "updatedAt": "2025-12-15T04:36:44.740Z",
      "member": {
        "id": 130,
        "groupId": 45,
        "name": "Andrik Roberto Mercado Sánchez",
        "phone": "7831266463",
        "birthday": "2010-08-25",
        "createdAt": "2025-12-15T04:06:00.782Z",
        "updatedAt": "2025-12-15T04:06:00.782Z"
      },
      "event": {
        "id": 121,
        "birthdayDate": "2025-06-14",
        "expectedAmount": 1200,
        "memberId": 132,
        "memberName": "Pako Mercado Escalante"
      }
    },
    {
      "id": 86,
      "birthdayEventId": 121,
      "memberId": 132,
      "amount": 200,
      "datePaid": "2025-12-14",
      "member": {
        "id": 132,
        "groupId": 45,
        "name": "Pako Mercado Escalante",
        "phone": "7831046697",
        "birthday": "1985-06-14",
        "createdAt": "2025-12-15T04:06:45.980Z",
        "updatedAt": "2025-12-15T04:06:45.980Z"
      },
      "event": {
        "id": 121,
        "birthdayDate": "2025-06-14",
        "expectedAmount": 1200,
        "memberId": 132,
        "memberName": "Pako Mercado Escalante"
      }
    },
    {
      "id": 87,
      "birthdayEventId": 121,
      "memberId": 133,
      "amount": 200,
      "datePaid": "2025-12-13",
      "member": {
        "id": 133,
        "groupId": 45,
        "name": "Scarlett Alexa Mercado Sánchez",
        "phone": "7831234567",
        "birthday": "2015-06-28",
        "createdAt": "2025-12-15T04:07:12.345Z",
        "updatedAt": "2025-12-15T04:07:12.345Z"
      },
      "event": {
        "id": 121,
        "birthdayDate": "2025-06-14",
        "expectedAmount": 1200,
        "memberId": 132,
        "memberName": "Pako Mercado Escalante"
      }
    }
  ]
}
```

---

## ❌ Error Responses

### **401 Unauthorized**
```json
{
  "error": "Usuario no autenticado"
}
```

### **400 Bad Request**
```json
{
  "error": "ID de grupo inválido"
}
```

### **404 Not Found**
```json
{
  "error": "Grupo no encontrado"
}
```

### **500 Internal Server Error**
```json
{
  "error": "Error interno del servidor"
}
```

---

## 🎯 Casos de Uso

### **1. Vista de Historial de Pagos del Grupo**

Muestra todos los pagos realizados en el grupo con información completa:

```typescript
const fetchGroupPayments = async (groupId: number) => {
  const response = await fetch(`/api/groups/${groupId}/payments`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  // Ahora tienes:
  // - data.totalPaid: Total pagado en el grupo
  // - data.totalPayments: Número de pagos
  // - data.payments: Array con información completa de cada pago
  
  return data;
};
```

### **2. Filtrar Pagos por Evento**

```typescript
const getPaymentsByEvent = (payments: GroupPaymentResponse[], eventId: number) => {
  return payments.filter(p => p.birthdayEventId === eventId);
};
```

### **3. Filtrar Pagos por Miembro**

```typescript
const getPaymentsByMember = (payments: GroupPaymentResponse[], memberId: number) => {
  return payments.filter(p => p.memberId === memberId);
};
```

### **4. Calcular Total Pagado por Miembro**

```typescript
const getTotalPaidByMember = (payments: GroupPaymentResponse[], memberId: number) => {
  return payments
    .filter(p => p.memberId === memberId)
    .reduce((sum, p) => sum + p.amount, 0);
};
```

### **5. Agrupar Pagos por Evento**

```typescript
const groupPaymentsByEvent = (payments: GroupPaymentResponse[]) => {
  return payments.reduce((acc, payment) => {
    const eventId = payment.birthdayEventId;
    if (!acc[eventId]) {
      acc[eventId] = {
        event: payment.event,
        payments: [],
        totalPaid: 0
      };
    }
    acc[eventId].payments.push(payment);
    acc[eventId].totalPaid += payment.amount;
    return acc;
  }, {} as Record<number, {
    event: GroupPaymentResponse['event'];
    payments: GroupPaymentResponse[];
    totalPaid: number;
  }>);
};
```

---

## 🚀 Ventajas de este Endpoint

### **Antes (Múltiples peticiones):**
```typescript
// 1. Obtener eventos del grupo
const events = await fetch(`/api/groups/${groupId}/events`);

// 2. Para cada evento, obtener pagos (N peticiones)
for (const event of events) {
  const payments = await fetch(`/api/events/${event.id}/payments`);
}

// 3. Para cada miembro, obtener información (M peticiones)
// Total: 1 + N + M peticiones
```

### **Ahora (1 sola petición):**
```typescript
// 1. Obtener TODOS los pagos con información completa
const allPayments = await fetch(`/api/groups/${groupId}/payments`);

// Ya tienes toda la información necesaria:
// - Pagos
// - Eventos
// - Miembros que pagaron
// - Miembros que cumplen años
// Total: 1 petición ✅
```

---

## 📊 Información Incluida

Cada pago incluye:

| Información | Descripción |
|-------------|-------------|
| **Pago** | ID, monto, fecha, comprobante |
| **Miembro que pagó** | Información completa del miembro |
| **Evento** | Fecha del cumpleaños, monto esperado |
| **Cumpleañero** | ID y nombre del miembro que cumple años |

---

## 🔄 Comparación con Endpoint Anterior

| Aspecto | `/api/events/:eventId/payments` | `/api/groups/:groupId/payments` |
|---------|--------------------------------|--------------------------------|
| **Alcance** | Pagos de UN evento | Pagos de TODOS los eventos del grupo |
| **Peticiones** | 1 por evento | 1 para todo el grupo |
| **Info del cumpleañero** | ❌ No incluida | ✅ Incluida (`event.memberName`) |
| **Uso recomendado** | Detalle de un pago específico | Vista general del grupo |

---

## 💡 Recomendaciones

1. **Usa este endpoint** para vistas generales del grupo (historial, dashboard)
2. **Usa `/api/events/:eventId/payments`** solo para detalles específicos de un pago
3. **Cachea la respuesta** en el frontend para evitar peticiones innecesarias
4. **Filtra y agrupa** los datos en el frontend según tus necesidades

---

## 📝 Notas Importantes

- Los pagos se ordenan por `datePaid` descendente (más recientes primero)
- Si el grupo no tiene pagos, devuelve un array vacío
- Todos los montos están en el formato numérico (ej: `500`, `1200.50`)
- Las fechas están en formato `"YYYY-MM-DD"` (ej: `"2025-12-15"`)
- El campo `member` puede ser `undefined` si el miembro fue eliminado

---

## 🔗 Endpoints Relacionados

- `GET /api/groups/:groupId/events` - Listar eventos del grupo
- `GET /api/groups/:groupId/members` - Listar miembros del grupo
- `GET /api/events/:eventId/payments` - Pagos de un evento específico (con resumen)
- `POST /api/events/:eventId/payments` - Crear un nuevo pago
- `PUT /api/payments/:paymentId` - Actualizar un pago
- `DELETE /api/payments/:paymentId` - Eliminar un pago

---

**Última actualización:** Diciembre 2025

