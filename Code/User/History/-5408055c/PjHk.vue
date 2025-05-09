<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'


import { useSessionController } from '@/sessions/controller/sessionController'
import { mapperEventToCalendar } from '@/sessions/helpers/mapper'
import { ISession } from '@/sessions/entities/session'

const refCalendar = ref()
const sessionController = useSessionController()

const sessionsWeek = ref<ISession[]>([])

const calendarOptions = computed(() => ({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  locale: ptBrLocale,
  headerToolbar: undefined, 
  selectable: false,
  editable: false,
  height: '100%',
  slotMinTime: '07:00:00',
  slotMaxTime: '22:00:00',
  events: sessionsWeek.value.map(mapperEventToCalendar),
  eventClassNames({ event }: any) {
    if (event.extendedProps.canceled) return ['bg-light-error', 'text-error']
    if (event.extendedProps.completed) return ['bg-light-success', 'text-success']
    return ['bg-light-primary', 'text-primary']
  },
}))

onMounted(async () => {
  sessionsWeek.value = await sessionController.getSessionsWeek();
})
</script>

<template>
  <div>
    <FullCalendar ref="refCalendar" :options="calendarOptions" />
  </div>
</template>

<style lang="scss">
@use "@/sessions/calendar/styleWeek.scss";


.calendars-checkbox {
  .v-label {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    opacity: var(--v-high-emphasis-opacity);
  }
}

.calendar-add-event-drawer {
  &.v-navigation-drawer:not(.v-navigation-drawer--temporary) {
    border-end-start-radius: 0.375rem;
    border-start-start-radius: 0.375rem;
  }

  &.v-navigation-drawer--temporary:not(.v-navigation-drawer--active) {
    transform: translateX(-110%) !important;
  }
}

.calendar-date-picker {
  display: none;

  + .flatpickr-input {
    + .flatpickr-calendar.inline {
      border: none;
      box-shadow: none;

      .flatpickr-months {
        border-block-end: none;
      }
    }
  }

  & ~ .flatpickr-calendar .flatpickr-weekdays {
    margin-block: 0 4px;
  }
}

.fc-toolbar-title, .fc-col-header-cell-cushion, .fc-list-event-time, .fc-list-day-side-text {
  text-transform: capitalize;
}


.v-layout {
  overflow: visible !important;

  .v-card {
    overflow: visible;
  }
}
</style>
