# Guía de Query Parameters - GET /api/groups

Esta guía explica cómo usar los query parameters del endpoint optimizado `GET /api/groups` para personalizar la respuesta según tus necesidades.

---

## 📋 Parámetros Disponibles

### 1. `limit` (number)
Limita el número de grupos devueltos.

**Uso:**
```bash
GET /api/groups?limit=5
```

**Casos de uso:**
- ✅ Paginación manual
- ✅ Vista previa de grupos
- ✅ Reducir tamaño de respuesta en dashboards

**Ejemplo:**
```typescript
// Solo obtener los 3 grupos más recientes
const response = await fetch('/api/groups?limit=3');
```

---

### 2. `includeMembers` (boolean)
Controla si se incluye el array de miembros en la respuesta.

**Default:** `true`

**Uso:**
```bash
GET /api/groups?includeMembers=false
```

**Casos de uso:**
- ✅ Solo necesitas estadísticas del grupo
- ✅ Reducir tamaño de respuesta
- ✅ Vista de lista simple sin detalles de miembros

**Nota:** Las estadísticas (`memberCount`) siempre se calculan.

**Ejemplo:**
```typescript
// Obtener grupos sin detalles de miembros
const response = await fetch('/api/groups?includeMembers=false');
// response.groups[0].memberCount = 7 (estadística disponible)
// response.groups[0].members = [] (array vacío)
```

---

### 3. `includeEvents` (boolean)
Controla si se incluye el array de eventos en la respuesta.

**Default:** `true`

**Uso:**
```bash
GET /api/groups?includeEvents=false
```

**Casos de uso:**
- ✅ Solo necesitas información de miembros
- ✅ Vista de configuración de grupos
- ✅ Reducir tamaño de respuesta

**Nota:** Las estadísticas (`eventCount`, `totalExpected`) siempre se calculan.

**Ejemplo:**
```typescript
// Obtener grupos sin eventos
const response = await fetch('/api/groups?includeEvents=false');
// response.groups[0].eventCount = 7 (estadística disponible)
// response.groups[0].events = [] (array vacío)
```

---

### 4. `includePayments` (boolean)
Controla si se incluye el array de pagos recientes en la respuesta.

**Default:** `true`

**Uso:**
```bash
GET /api/groups?includePayments=false
```

**Casos de uso:**
- ✅ Solo necesitas información de miembros y eventos
- ✅ Vista de planificación sin historial de pagos
- ✅ Reducir tamaño de respuesta

**Nota:** Las estadísticas (`totalPaid`) siempre se calculan.

**Ejemplo:**
```typescript
// Obtener grupos sin pagos
const response = await fetch('/api/groups?includePayments=false');
// response.groups[0].totalPaid = 9700 (estadística disponible)
// response.groups[0].recentPayments = [] (array vacío)
```

---

### 5. `paymentsLimit` (number)
Limita el número de pagos recientes devueltos por grupo.

**Default:** `10`

**Uso:**
```bash
GET /api/groups?paymentsLimit=5
```

**Casos de uso:**
- ✅ Mostrar solo los últimos N pagos
- ✅ Reducir tamaño de respuesta
- ✅ Vista de actividad reciente

**Ejemplo:**
```typescript
// Obtener solo los últimos 3 pagos de cada grupo
const response = await fetch('/api/groups?paymentsLimit=3');
// response.groups[0].recentPayments.length <= 3
```

---

## 🎯 Casos de Uso Comunes

### Dashboard Principal (Respuesta Completa)
```bash
GET /api/groups
```
Devuelve toda la información: miembros, eventos, y últimos 10 pagos.

---

### Lista Simple de Grupos (Solo Estadísticas)
```bash
GET /api/groups?includeMembers=false&includeEvents=false&includePayments=false
```
Devuelve solo información básica y estadísticas calculadas.

**Respuesta:**
```json
{
  "groups": [{
    "id": 1,
    "name": "Familia Mercado",
    "amountPerBirthday": 200,
    "memberCount": 7,      // ✅ Disponible
    "eventCount": 7,       // ✅ Disponible
    "totalExpected": 9800, // ✅ Disponible
    "totalPaid": 9700,     // ✅ Disponible
    "members": [],         // ❌ Array vacío
    "events": [],          // ❌ Array vacío
    "recentPayments": []   // ❌ Array vacío
  }]
}
```

---

### Vista de Miembros (Sin Eventos ni Pagos)
```bash
GET /api/groups?includeEvents=false&includePayments=false
```
Devuelve grupos con miembros pero sin eventos ni pagos.

---

### Actividad Reciente (Solo Últimos 5 Pagos)
```bash
GET /api/groups?includeMembers=false&includeEvents=false&paymentsLimit=5
```
Devuelve solo los últimos 5 pagos de cada grupo.

---

### Primer Grupo con Información Completa
```bash
GET /api/groups?limit=1
```
Devuelve solo el grupo más reciente con toda su información.

---

### Optimización Máxima (Solo 3 Grupos, Sin Miembros, 3 Pagos)
```bash
GET /api/groups?limit=3&includeMembers=false&paymentsLimit=3
```
Respuesta mínima para dashboards ligeros.

---

## 📊 Comparación de Tamaño de Respuesta

| Configuración | Tamaño Aprox. | Uso Recomendado |
|---------------|---------------|-----------------|
| Sin parámetros | ~50KB | Dashboard completo |
| `includeMembers=false&includeEvents=false&includePayments=false` | ~2KB | Lista simple |
| `limit=1` | ~15KB | Vista de grupo individual |
| `paymentsLimit=3` | ~35KB | Dashboard con actividad reciente |

*Tamaños aproximados para 5 grupos con 7 miembros cada uno*

---

## ⚠️ Consideraciones Importantes

### 1. Las Estadísticas Siempre se Calculan
Independientemente de los parámetros `include*`, las siguientes estadísticas **siempre están disponibles**:
- `memberCount`
- `eventCount`
- `totalExpected`
- `totalPaid`

Esto significa que aunque excluyas los arrays, las estadísticas se calculan en el backend.

### 2. Performance
- Excluir arrays **NO mejora significativamente** el performance del backend
- Los datos se cargan igualmente para calcular estadísticas
- La mejora principal es en el **tamaño de la respuesta HTTP**

### 3. Validación
- `limit` debe ser un número positivo
- `paymentsLimit` debe ser un número positivo
- Los parámetros booleanos aceptan `"true"` o `"false"` como strings

---

## 🔧 Ejemplos en Código

### JavaScript/TypeScript

```typescript
// Función helper para construir URL con query params
function getGroupsUrl(options: {
  limit?: number;
  includeMembers?: boolean;
  includeEvents?: boolean;
  includePayments?: boolean;
  paymentsLimit?: number;
} = {}) {
  const params = new URLSearchParams();
  
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.includeMembers === false) params.append('includeMembers', 'false');
  if (options.includeEvents === false) params.append('includeEvents', 'false');
  if (options.includePayments === false) params.append('includePayments', 'false');
  if (options.paymentsLimit) params.append('paymentsLimit', options.paymentsLimit.toString());
  
  return `/api/groups${params.toString() ? '?' + params.toString() : ''}`;
}

// Uso
const url1 = getGroupsUrl({ limit: 5 });
// "/api/groups?limit=5"

const url2 = getGroupsUrl({ includeMembers: false, paymentsLimit: 3 });
// "/api/groups?includeMembers=false&paymentsLimit=3"

const url3 = getGroupsUrl();
// "/api/groups"
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

function useGroups(options = {}) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const url = getGroupsUrl(options);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setGroups(data.groups);
      setLoading(false);
    };

    fetchGroups();
  }, [options]);

  return { groups, loading };
}

// Uso en componente
function Dashboard() {
  // Solo estadísticas para la lista
  const { groups } = useGroups({
    includeMembers: false,
    includeEvents: false,
    includePayments: false
  });

  return (
    <div>
      {groups.map(group => (
        <div key={group.id}>
          <h3>{group.name}</h3>
          <p>Miembros: {group.memberCount}</p>
          <p>Total: ${group.totalPaid}/${group.totalExpected}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📝 Resumen

✅ **Usa query parameters para:**
- Reducir tamaño de respuesta HTTP
- Optimizar ancho de banda
- Mejorar experiencia de usuario en conexiones lentas
- Cargar solo los datos necesarios en cada vista

❌ **NO uses query parameters si:**
- Necesitas toda la información del grupo
- Estás en una conexión rápida y el tamaño no importa
- Prefieres simplicidad sobre optimización

---

**Última actualización**: 2024-12-15

