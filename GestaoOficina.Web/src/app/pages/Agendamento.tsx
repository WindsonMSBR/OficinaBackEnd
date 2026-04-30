import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react";

const agendamentosData = [
  {
    id: 1,
    data: "2026-04-29",
    hora: "09:00",
    cliente: "João Silva",
    placa: "ABC-1234",
    servico: "Troca de óleo",
  },
  {
    id: 2,
    data: "2026-04-29",
    hora: "14:00",
    cliente: "Maria Santos",
    placa: "DEF-5678",
    servico: "Revisão completa",
  },
  {
    id: 3,
    data: "2026-04-30",
    hora: "10:00",
    cliente: "Pedro Costa",
    placa: "GHI-9012",
    servico: "Alinhamento",
  },
  {
    id: 4,
    data: "2026-05-02",
    hora: "11:00",
    cliente: "Ana Oliveira",
    placa: "JKL-3456",
    servico: "Troca de pastilhas",
  },
  {
    id: 5,
    data: "2026-05-05",
    hora: "15:00",
    cliente: "Carlos Mendes",
    placa: "MNO-7890",
    servico: "Balanceamento",
  },
];

export function Agendamento() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 29));
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getAgendamentosForDate = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return agendamentosData.filter((ag) => ag.data === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const openNewAgendamento = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setShowModal(true);
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-primary">Agendamentos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("month")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === "month"
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === "week"
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setViewMode("day")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === "day"
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Dia
          </button>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-primary" />
          </button>
          <h2 className="text-primary">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronRight size={24} className="text-primary" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center p-3 bg-primary text-primary-foreground rounded-lg"
            >
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const agendamentos = getAgendamentosForDate(day);
            const isToday =
              day === 29 &&
              currentDate.getMonth() === 3 &&
              currentDate.getFullYear() === 2026;

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-border rounded-lg ${
                  day ? "bg-card hover:bg-muted cursor-pointer" : "bg-muted/30"
                } ${isToday ? "ring-2 ring-accent" : ""}`}
                onClick={() => day && openNewAgendamento(day)}
              >
                {day && (
                  <>
                    <div className="text-sm mb-2 text-muted-foreground">
                      {day}
                    </div>
                    <div className="space-y-1">
                      {agendamentos.map((ag) => (
                        <div
                          key={ag.id}
                          className="bg-accent/20 border border-accent p-2 rounded text-xs"
                        >
                          <div className="text-accent">{ag.hora}</div>
                          <div className="truncate">{ag.placa}</div>
                          <div className="truncate text-muted-foreground">
                            {ag.servico}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-primary">Novo Agendamento</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block mb-2 text-muted-foreground">Data</label>
                <input
                  type="date"
                  value={selectedDate || ""}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">Horário</label>
                <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecione...</option>
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">Cliente</label>
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">
                  Placa do Veículo
                </label>
                <input
                  type="text"
                  placeholder="ABC-1234"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">
                  Serviço Principal
                </label>
                <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecione...</option>
                  <option value="troca-oleo">Troca de óleo</option>
                  <option value="revisao">Revisão completa</option>
                  <option value="alinhamento">Alinhamento</option>
                  <option value="balanceamento">Balanceamento</option>
                  <option value="freio">Troca de pastilhas de freio</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
