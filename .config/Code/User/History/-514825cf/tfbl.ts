import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { computed, ref, Ref, watch } from "vue";
import { Event } from "../calendar/types";
import { CalendarApi, CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { EventImpl } from "@fullcalendar/core/internal";
import { useCalendarController } from '../controller/calendarController';
import { ISession, ISessionCreate } from '../entities/session';
import { useSessionController } from '../controller/sessionController';
import { mapperEventToCalendar } from '../helpers/mapper';
import { IEmployeeEssential } from '@/employees/entities/employee';
import { useRouter } from 'vue-router';
import { IListService } from '@/clinic/entities/service';
import { IListClient } from '@/clients/entities/client';


export const useCalendarComposable = (event: Ref<any>, showEventSidebar: Ref<boolean>, isLeftSidebarActive: Ref<boolean>) => {
  const calendarController = useCalendarController()
  const sessionController = useSessionController()
  const router = useRouter()

  const refCalendar = ref()

  const filters = ref({
    completed: false,
    canceled: false
  })
  const currentDate = ref<any>({
    start: null,
    end: null,
    startStr: null,
    endStr: null
  })

  const calendarsColor = {
    active: 'primary',
    completed: 'success',
    canceled: 'error'
  }

  const mapperEvent = (event: Event): ISession => {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      start_date: event.start as string,
      end_date: event.end as string,
      all_day: event.allDay,
      completed: event.extendedProps?.completed,
      clients: event.extendedProps?.clients,
      physiotherapists: event.extendedProps?.physiotherapists,
      services: event.extendedProps?.services,
      canceled: event.extendedProps?.canceled,
    }
  }

  const mapperEventToEdit = (event: Event): ISessionCreate => {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      start_date: event.start as string,
      end_date: event.end as string,
      all_day: event.allDay,
      completed: event.extendedProps?.completed,
      clients: (event.extendedProps?.clients).map((client: IListClient) => client.id),
      physiotherapists: event.extendedProps?.physiotherapists.map((physiotherapist: IEmployeeEssential) => physiotherapist.id),
      services: event.extendedProps?.services.map((service: IListService) => service.id),
    }
  }

  const calendarApi = ref<null | CalendarApi>(null)
  const blankEvent = ref<Partial<ISession>>({
    id: "",
    all_day: false,
    start_date: "",
    end_date: "",
    title: "",
  })

  const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: 'timeGridWeek',
    locale: ptBrLocale,
    headerToolbar: {
      start: 'drawerToggler,prev,next today',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      center: 'title',
    },
    selectable: true,
    forceEventDuration: true,
    editable: true,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 2,
    navLinks: true,
    events: sessionController.sessions.map((session) => {
      return {
        ...mapperEventToCalendar(session),
      }
    }),

    eventClassNames({ event: calendarEvent }: { event: EventImpl }) {
      const colorName = calendarsColor[calendarEvent._def.extendedProps.completed ? 'completed' : calendarEvent._def.extendedProps.canceled ? 'canceled' : 'active'] as keyof typeof calendarsColor
      return [
        `bg-light-${colorName} text-${colorName}`,
      ]
    },

    eventClick({ event, jsEvent }: { event: any, jsEvent: any }) {
      if (jsEvent.ctrlKey || event.extendedProps?.completed || event.extendedProps?.canceled) {
        router.push({
          name: 'session-detail',
          params: {
            id: event.id,
          },
        })
      } else {
        showEventSidebar.value = true
        calendarController.state.currentEvent = {
          ...mapperEvent(event),
        }
      }
    },

    select(selectInfo: any) {
      calendarController.state.currentEvent = {
        ...blankEvent.value as ISession,
        all_day: selectInfo.allDay,
        start_date: selectInfo.start,
        end_date: selectInfo.end,
      }
      showEventSidebar.value = true
    },

    async datesSet(dateInfo: any) {
      currentDate.value = {
        ...dateInfo
      }
      await sessionController.getSessionsByDate(dateInfo.startStr, dateInfo.endStr, "", filters.value)
    },

    async eventDrop({ event }: { event: any }) {
      const session = mapperEventToEdit(event)
      const sessionUpdated = await sessionController.editSession(session)
      const findSessionIndex = sessionController.sessions.findIndex((s) => s.id === sessionUpdated.id)
      if (findSessionIndex != -1) {
        sessionController.sessions[findSessionIndex] = sessionUpdated
      }
    },

    async eventResize({ event }: { event: any }) {
      const session = mapperEventToEdit(event)
      const sessionUpdated = await sessionController.editSession(session)
      const findSessionIndex = sessionController.sessions.findIndex((s) => s.id === sessionUpdated.id)
      if (findSessionIndex != -1) {
        sessionController.sessions[findSessionIndex] = sessionUpdated
      }
    },

    customButtons: {
      drawerToggler: {
        text: 'calendarDrawerToggler',
        click() {
          isLeftSidebarActive.value = true
        },
      },
    },
  })) as CalendarOptions

  watch(() => refCalendar.value, () => {
    calendarApi.value = refCalendar.value.getApi()
  })

  const jumpToDate = (currentDate: string) => {
    calendarApi.value?.gotoDate(new Date(currentDate))
  }

  watch(() => filters.value, async () => {
    await sessionController.getSessionsByDate(currentDate.value.startStr, currentDate.value.endStr, '', filters.value)
  }, { deep: true })

  return {
    refCalendar,
    calendarOptions,
    blankEvent,
    filters,
    jumpToDate,
  }
}
