# Endpoint Optimizado: GET /api/groups

## 🚀 Optimización Implementada

Este documento describe la optimización realizada al endpoint `GET /api/groups` para reducir significativamente el número de peticiones desde el frontend.

---

## 📊 Problema Original

**Antes de la optimización**, para mostrar la lista de grupos con información completa, el frontend necesitaba hacer:

1. `GET /api/groups` - Obtener lista básica de grupos
2. Para cada grupo:
   - `GET /api/groups/:groupId/members` - Obtener miembros
   - `GET /api/groups/:groupId/events` - Obtener eventos
   - `GET /api/groups/:groupId/payments` - Obtener pagos

**Total**: 1 + (N × 3) peticiones, donde N = número de grupos

**Ejemplo**: Para 5 grupos = **16 peticiones** 😱

---

## ✅ Solución Implementada

**Después de la optimización**, el frontend solo necesita:

1. `GET /api/groups` - Obtiene TODO en una sola petición

**Total**: **1 petición** 🎉

---

## 🔍 Query Parameters Disponibles

El endpoint soporta los siguientes parámetros de consulta para optimizar la respuesta:

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `limit` | number | - | Limita el número de grupos devueltos |
| `includeMembers` | boolean | `true` | Incluir array de miembros |
| `includeEvents` | boolean | `true` | Incluir array de eventos |
| `includePayments` | boolean | `true` | Incluir array de pagos recientes |
| `paymentsLimit` | number | `10` | Número máximo de pagos recientes por grupo |

### Ejemplos de Uso

```bash
# Obtener solo el primer grupo
GET /api/groups?limit=1

# Obtener grupos sin miembros
GET /api/groups?includeMembers=false

# Obtener solo estadísticas (sin arrays)
GET /api/groups?includeMembers=false&includeEvents=false&includePayments=false

# Obtener grupos con solo 3 pagos recientes
GET /api/groups?paymentsLimit=3

# Combinación: primer grupo, sin eventos, 5 pagos
GET /api/groups?limit=1&includeEvents=false&paymentsLimit=5
```

**Nota Importante:** Las estadísticas (`memberCount`, `eventCount`, `totalExpected`, `totalPaid`) **siempre se calculan** independientemente de los parámetros `include*`. Solo los arrays se omiten cuando se especifica `false`.

---

## 📦 Información Incluida

El endpoint ahora devuelve para cada grupo:

### Información Básica
- `id`, `userId`, `name`, `amountPerBirthday`, `description`
- `createdAt`, `updatedAt`

### Estadísticas Calculadas
- `memberCount` - Total de miembros en el grupo
- `eventCount` - Total de eventos generados
- `totalExpected` - Suma de `expectedAmount` de todos los eventos
- `totalPaid` - Total pagado en el grupo (suma de todos los pagos)

### Colecciones Relacionadas
- `members[]` - Array con todos los miembros del grupo
  - `id`, `name`, `phone`, `birthday`, `photoUrl`
  - **Ordenamiento**: Por fecha de creación DESC (más recientes primero)
  
- `events[]` - Array con todos los eventos del grupo
  - `id`, `memberId`, `memberName`, `birthdayDate`, `expectedAmount`, `totalPaid`
  - **Ordenamiento**: Por fecha del evento DESC (más próximos/recientes primero)
  
- `recentPayments[]` - Array con los últimos 10 pagos del grupo
  - `id`, `memberId`, `memberName`, `birthdayEventId`, `amount`, `datePaid`
  - **Ordenamiento**: Por fecha de pago DESC (más recientes primero)

---

## 🔧 Implementación Técnica

### Estrategia de Optimización

1. **Carga en lote**: Se cargan todos los datos relacionados en 4 queries principales:
   - Grupos del usuario
   - Todos los miembros de esos grupos
   - Todos los eventos de esos grupos
   - Todos los pagos de esos eventos

2. **Agrupación en memoria**: Se usan `Map` para agrupar datos por grupo/evento:
   ```typescript
   const membersByGroup = new Map<number, Member[]>();
   const eventsByGroup = new Map<number, Event[]>();
   const paymentsByEvent = new Map<number, Payment[]>();
   ```

3. **Cálculos en memoria**: Las estadísticas se calculan iterando sobre los datos ya cargados, sin queries adicionales.

### Ventajas

- ✅ **Reducción de queries**: De N×3 a 4 queries constantes
- ✅ **Menor latencia**: Una sola petición HTTP desde el frontend
- ✅ **Datos consistentes**: Todos los datos se obtienen en el mismo momento
- ✅ **Mejor UX**: Carga más rápida de la interfaz
- ✅ **Escalable**: El número de queries no crece con el número de grupos

---

## 📝 Ejemplo de Respuesta

```json
{
  "message": "Grupos obtenidos exitosamente",
  "groups": [
    {
      "id": 45,
      "userId": 1,
      "name": "Familia Mercado Sánchez",
      "amountPerBirthday": 200,
      "description": null,
      "createdAt": "2025-12-15T04:04:32.510Z",
      "updatedAt": "2025-12-15T04:04:32.510Z",
      
      "memberCount": 7,
      "eventCount": 7,
      "totalExpected": 9800,
      "totalPaid": 9700,
      
      "members": [
        {
          "id": 128,
          "name": "Sissy Shirley Sánchez Valdivieso",
          "phone": "7831362077",
          "birthday": "1984-10-30"
        }
        // ... más miembros
      ],
      
      "events": [
        {
          "id": 117,
          "memberId": 128,
          "memberName": "Sissy Shirley Sánchez Valdivieso",
          "birthdayDate": "2025-10-30",
          "expectedAmount": 1400,
          "totalPaid": 1400
        }
        // ... más eventos
      ],
      
      "recentPayments": [
        {
          "id": 107,
          "memberId": 134,
          "memberName": "Toribio Mercado Sánchez",
          "birthdayEventId": 123,
          "amount": 200,
          "datePaid": "2025-12-15"
        }
        // ... hasta 10 pagos recientes
      ]
    }
  ]
}
```

---

## 🎯 Casos de Uso en el Frontend

### Dashboard Principal
```typescript
// Una sola petición para obtener todo
const { data } = await api.get('/api/groups');

// Mostrar lista de grupos con estadísticas
data.groups.forEach(group => {
  console.log(`${group.name}: ${group.memberCount} miembros, $${group.totalPaid}/$${group.totalExpected}`);
});
```

### Vista de Grupo Individual
```typescript
// Ya tienes todos los datos del grupo
const group = data.groups.find(g => g.id === selectedGroupId);

// Mostrar miembros
group.members.forEach(member => {
  console.log(`${member.name} - ${member.birthday}`);
});

// Mostrar eventos
group.events.forEach(event => {
  console.log(`${event.memberName}: ${event.birthdayDate} - $${event.totalPaid}/$${event.expectedAmount}`);
});

// Mostrar pagos recientes
group.recentPayments.forEach(payment => {
  console.log(`${payment.memberName} pagó $${payment.amount} el ${payment.datePaid}`);
});
```

---

## 📈 Métricas de Rendimiento

### Antes vs Después

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Peticiones HTTP (5 grupos) | 16 | 1 | **-94%** |
| Queries a BD (5 grupos) | ~16 | 4 | **-75%** |
| Tiempo de carga estimado* | ~1600ms | ~200ms | **-87%** |

*Asumiendo 100ms por petición HTTP

---

## ⚠️ Consideraciones

### Límites
- Los `recentPayments` están limitados a los últimos 10 para mantener la respuesta manejable
- Si un grupo tiene muchos miembros/eventos, la respuesta puede ser grande

### Cuándo NO usar este endpoint
- Si solo necesitas información básica de un grupo específico, usa `GET /api/groups/:id`
- Si solo necesitas los miembros de un grupo, usa `GET /api/groups/:groupId/members`

### Cuándo SÍ usar este endpoint
- ✅ Dashboard principal que muestra todos los grupos
- ✅ Vista de resumen de grupos con estadísticas
- ✅ Cualquier vista que necesite información de múltiples grupos

---

## 🔄 Endpoints Complementarios

Este endpoint optimizado **no reemplaza** los endpoints individuales, que siguen siendo útiles para:

- `GET /api/groups/:id` - Detalle de un grupo específico
- `GET /api/groups/:groupId/members` - Lista completa de miembros (sin límite)
- `GET /api/groups/:groupId/events` - Lista completa de eventos
- `GET /api/groups/:groupId/payments` - Lista completa de pagos (sin límite de 10)

---

## 📚 Tipos TypeScript

Los tipos actualizados están disponibles en `docs/API/API_TYPES.ts`:

```typescript
export interface GroupDetailedResponse extends GroupResponse {
  memberCount: number;
  eventCount: number;
  totalExpected: number;
  totalPaid: number;
  members: GroupMemberSummary[];
  events: GroupEventSummary[];
  recentPayments: GroupPaymentSummary[];
}

export interface ListGroupsResponse {
  message: string;
  groups: GroupDetailedResponse[];
}
```

---

**Última actualización**: 2024-12-15

