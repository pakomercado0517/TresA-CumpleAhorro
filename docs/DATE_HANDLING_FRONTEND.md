# Manejo de Fechas - Guía para el Frontend

Esta guía explica cómo el frontend debe manejar las fechas al interactuar con la API.

## 📋 Resumen Rápido

- **Enviar al backend**: Formato `yyyy-MM-dd` (ejemplo: `"2024-12-15"`)
- **Recibir del backend**: Formato `yyyy-MM-dd` para fechas de solo fecha, ISO 8601 para timestamps
- **Timezone**: El backend maneja automáticamente la conversión (Veracruz, México)
- **No hacer conversiones**: El frontend NO debe convertir timezones, el backend lo hace automáticamente

---

## 🎯 Formatos de Fechas

### 1. Fechas de Solo Fecha (DATEONLY)

**Campos afectados:**
- `birthday` (Miembros)
- `birthdayDate` (Eventos)
- `datePaid` (Pagos)

**Formato requerido:** `yyyy-MM-dd`

**Ejemplos:**
```typescript
"2024-12-15"  // ✅ Correcto
"2024-3-5"    // ❌ Incorrecto (debe ser "2024-03-05")
"15/12/2024"  // ❌ Incorrecto (formato incorrecto)
"2024-12-15T10:00:00"  // ❌ Incorrecto (no incluir hora)
```

### 2. Timestamps (createdAt, updatedAt)

**Formato recibido:** ISO 8601 (UTC)

**Ejemplos:**
```typescript
"2024-12-15T10:30:00.000Z"  // Formato completo ISO 8601
```

**Nota:** Estos campos son solo lectura, el frontend no los envía.

---

## 📤 Enviar Fechas al Backend

### Campos que requieren fechas

#### 1. Crear/Actualizar Miembro
```typescript
{
  name: string;
  birthday: "2024-12-15";  // Formato: yyyy-MM-dd
  phone?: string;
  photoUrl?: string;
}
```

#### 2. Crear/Actualizar Pago
```typescript
{
  memberId: number;
  amount: number;
  datePaid: "2024-12-15";  // Formato: yyyy-MM-dd
  proofUrl?: string;
}
```

### Validaciones del Backend

El backend valida que:
- ✅ La fecha esté en formato `yyyy-MM-dd`
- ✅ La fecha sea válida (no fechas como `2024-13-45`)
- ✅ La fecha no sea futura (para `birthday` y `datePaid`)

**Ejemplo de error:**
```json
{
  "error": "La fecha de cumpleaños no puede ser futura"
}
```

---

## 📥 Recibir Fechas del Backend

### Fechas de Solo Fecha (DATEONLY)

**Formato recibido:** `yyyy-MM-dd`

**Ejemplo de respuesta:**
```json
{
  "id": 1,
  "name": "María González",
  "birthday": "1990-03-15",  // Formato: yyyy-MM-dd
  "groupId": 1
}
```

**Uso en el frontend:**
```typescript
// Puedes usar directamente en inputs de tipo "date"
<input type="date" value={member.birthday} />

// O formatear para mostrar
const formattedDate = new Date(member.birthday + "T00:00:00")
  .toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
// Resultado: "15 de marzo de 1990"
```

### Timestamps (createdAt, updatedAt)

**Formato recibido:** ISO 8601 (UTC)

**Ejemplo:**
```json
{
  "id": 1,
  "name": "María González",
  "createdAt": "2024-12-15T10:30:00.000Z",
  "updatedAt": "2024-12-15T10:30:00.000Z"
}
```

**Uso en el frontend:**
```typescript
// Convertir a fecha local para mostrar
const createdAt = new Date(member.createdAt);
const formatted = createdAt.toLocaleString("es-MX", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});
// Resultado: "15 de diciembre de 2024, 04:30" (ajustado a Veracruz)
```

---

## 🔄 Flujo Completo de Ejemplo

### Crear un Miembro

**1. Frontend prepara los datos:**
```typescript
const memberData = {
  name: "María González",
  birthday: "1990-03-15",  // Formato yyyy-MM-dd
  phone: "1234567890"
};

// Enviar al backend
const response = await fetch("/api/groups/1/members", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(memberData)
});
```

**2. Backend recibe y procesa:**
- Recibe: `"1990-03-15"` (interpretado como Veracruz)
- Convierte a UTC para guardar en BD
- Guarda en base de datos

**3. Backend responde:**
```json
{
  "message": "Miembro creado exitosamente",
  "member": {
    "id": 1,
    "name": "María González",
    "birthday": "1990-03-15",  // Mismo formato, ya convertido
    "createdAt": "2024-12-15T10:30:00.000Z"
  }
}
```

**4. Frontend recibe y muestra:**
```typescript
const member = response.member;

// Usar directamente en input date
<input type="date" value={member.birthday} />

// O formatear para mostrar
const displayDate = new Date(member.birthday + "T00:00:00")
  .toLocaleDateString("es-MX");
```

---

## ⚠️ Reglas Importantes

### ✅ HACER

1. **Usar formato `yyyy-MM-dd`** para todas las fechas de solo fecha
2. **Enviar fechas como strings**, no como objetos Date
3. **Usar directamente** las fechas recibidas del backend (ya están convertidas)
4. **Formatear solo para mostrar** al usuario, no para enviar al backend

### ❌ NO HACER

1. **NO convertir timezones** manualmente (el backend lo hace)
2. **NO enviar objetos Date** directamente (convertir a string primero)
3. **NO incluir hora** en fechas DATEONLY (solo fecha)
4. **NO usar formatos diferentes** a `yyyy-MM-dd`

---

## 🛠️ Utilidades Recomendadas para el Frontend

### Opción 1: date-fns (Recomendado)

```typescript
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

// Formatear fecha recibida del backend para mostrar
const displayDate = format(
  parseISO(member.birthday + "T00:00:00"),
  "dd 'de' MMMM 'de' yyyy",
  { locale: es }
);
// Resultado: "15 de marzo de 1990"

// Formatear timestamp para mostrar
const displayTimestamp = format(
  parseISO(member.createdAt),
  "dd/MM/yyyy HH:mm",
  { locale: es }
);
// Resultado: "15/12/2024 04:30"
```

### Opción 2: JavaScript Nativo

```typescript
// Formatear fecha DATEONLY para mostrar
const formatDateOnly = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

// Formatear timestamp para mostrar
const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
```

### Opción 3: React Hook Form + date-fns

```typescript
import { useForm } from "react-hook-form";
import { format } from "date-fns";

const { register, handleSubmit } = useForm();

// Input de fecha
<input
  type="date"
  {...register("birthday", {
    required: true,
    valueAsDate: false  // Mantener como string
  })}
/>

// Al enviar, el valor ya está en formato yyyy-MM-dd
const onSubmit = (data) => {
  // data.birthday ya está en formato "2024-12-15"
  fetch("/api/groups/1/members", {
    method: "POST",
    body: JSON.stringify(data)
  });
};
```

---

## 📝 Ejemplos Prácticos

### Ejemplo 1: Formulario de Crear Miembro

```typescript
import { useState } from "react";

function CreateMemberForm() {
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",  // Formato: yyyy-MM-dd
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // El valor del input type="date" ya está en formato yyyy-MM-dd
    const response = await fetch("/api/groups/1/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Miembro creado:", result.member);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nombre"
      />
      
      <input
        type="date"
        value={formData.birthday}
        onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
        // El valor ya está en formato yyyy-MM-dd
      />
      
      <button type="submit">Crear Miembro</button>
    </form>
  );
}
```

### Ejemplo 2: Mostrar Fecha Formateada

```typescript
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

function MemberCard({ member }: { member: MemberResponse }) {
  // Formatear birthday para mostrar
  const formattedBirthday = format(
    parseISO(member.birthday + "T00:00:00"),
    "dd 'de' MMMM 'de' yyyy",
    { locale: es }
  );

  // Formatear createdAt para mostrar
  const formattedCreatedAt = format(
    parseISO(member.createdAt),
    "dd/MM/yyyy 'a las' HH:mm",
    { locale: es }
  );

  return (
    <div>
      <h3>{member.name}</h3>
      <p>Cumpleaños: {formattedBirthday}</p>
      <p>Creado: {formattedCreatedAt}</p>
    </div>
  );
}
```

### Ejemplo 3: Validar Fecha Antes de Enviar

```typescript
const validateDate = (dateString: string): boolean => {
  // Verificar formato yyyy-MM-dd
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  // Verificar que sea una fecha válida
  const date = new Date(dateString + "T00:00:00");
  if (isNaN(date.getTime())) {
    return false;
  }

  // Verificar que no sea futura (para birthday)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) {
    return false;
  }

  return true;
};

// Uso
const handleSubmit = (birthday: string) => {
  if (!validateDate(birthday)) {
    alert("Fecha inválida");
    return;
  }
  
  // Enviar al backend...
};
```

---

## 🔍 Debugging

### Verificar formato de fecha

```typescript
// Verificar que la fecha esté en formato correcto
const isValidFormat = (dateString: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
};

// Ejemplo
isValidFormat("2024-12-15");  // true
isValidFormat("2024-3-5");    // false
isValidFormat("15/12/2024");  // false
```

### Logging para debugging

```typescript
const sendDateToBackend = async (dateString: string) => {
  console.log("Enviando fecha:", dateString);
  console.log("Formato válido:", /^\d{4}-\d{2}-\d{2}$/.test(dateString));
  
  const response = await fetch("/api/endpoint", {
    method: "POST",
    body: JSON.stringify({ date: dateString })
  });
  
  const result = await response.json();
  console.log("Fecha recibida del backend:", result.date);
};
```

---

## 📚 Resumen de Formatos

| Tipo de Campo | Formato al Enviar | Formato al Recibir | Ejemplo |
|--------------|-------------------|-------------------|---------|
| `birthday` | `yyyy-MM-dd` | `yyyy-MM-dd` | `"1990-03-15"` |
| `birthdayDate` | `yyyy-MM-dd` | `yyyy-MM-dd` | `"2024-03-15"` |
| `datePaid` | `yyyy-MM-dd` | `yyyy-MM-dd` | `"2024-12-15"` |
| `createdAt` | N/A (solo lectura) | ISO 8601 | `"2024-12-15T10:30:00.000Z"` |
| `updatedAt` | N/A (solo lectura) | ISO 8601 | `"2024-12-15T10:30:00.000Z"` |

---

## ✅ Checklist para el Frontend

- [ ] Todas las fechas DATEONLY se envían en formato `yyyy-MM-dd`
- [ ] No se convierten timezones manualmente
- [ ] Los inputs de fecha usan `type="date"` (que ya genera formato correcto)
- [ ] Las fechas recibidas se formatean solo para mostrar, no para enviar
- [ ] Se valida el formato antes de enviar (opcional pero recomendado)
- [ ] Los timestamps se formatean para mostrar en zona horaria local

---

**Última actualización**: 2024-12-09

