import { db } from "@/lib/db";
import { addDays, daysBetween } from "@/lib/date";

interface Log {
  id: string;
  start_date: Date;
  end_date: Date | null;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

export async function setMenstruationDay(
  userId: string,
  day: Date,
  active: boolean,
  today: Date
): Promise<void> {
  const logs: Log[] = await db.menstruationLog.findMany({
    where: { userId },
    orderBy: { start_date: "asc" },
    select: { id: true, start_date: true, end_date: true },
  });

  const effEnd = (l: Log): Date => l.end_date ?? today;
  const covers = (l: Log): boolean =>
    l.start_date.getTime() <= day.getTime() &&
    day.getTime() <= effEnd(l).getTime();

  if (active) {
    if (logs.some(covers)) return;

    const before = logs.find((l) => sameDay(effEnd(l), addDays(day, -1)));
    const after = logs.find((l) => sameDay(l.start_date, addDays(day, 1)));

    if (before && after) {
      const mergedEnd = after.end_date;
      await db.$transaction([
        db.menstruationLog.update({
          where: { id: before.id },
          data: {
            end_date: mergedEnd,
            period_length: mergedEnd
              ? daysBetween(before.start_date, mergedEnd) + 1
              : null,
          },
        }),
        db.menstruationLog.delete({ where: { id: after.id } }),
      ]);
      return;
    }
    if (before) {
      await db.menstruationLog.update({
        where: { id: before.id },
        data: {
          end_date: day,
          period_length: daysBetween(before.start_date, day) + 1,
        },
      });
      return;
    }
    if (after) {
      await db.menstruationLog.update({
        where: { id: after.id },
        data: {
          start_date: day,
          period_length: after.end_date
            ? daysBetween(day, after.end_date) + 1
            : null,
        },
      });
      return;
    }
    await db.menstruationLog.create({
      data: {
        userId,
        start_date: day,
        end_date: day,
        period_length: 1,
        source: "MANUAL",
      },
    });
    return;
  }

  const covering = logs.find(covers);
  if (!covering) return;

  const start = covering.start_date;
  const eEnd = effEnd(covering);
  const isStart = sameDay(start, day);
  const isEnd = sameDay(eEnd, day);

  if (isStart && isEnd) {
    await db.menstruationLog.delete({ where: { id: covering.id } });
    return;
  }
  if (isStart) {
    const newStart = addDays(day, 1);
    await db.menstruationLog.update({
      where: { id: covering.id },
      data: {
        start_date: newStart,
        period_length: covering.end_date
          ? daysBetween(newStart, covering.end_date) + 1
          : null,
      },
    });
    return;
  }
  if (isEnd) {
    const newEnd = addDays(day, -1);
    await db.menstruationLog.update({
      where: { id: covering.id },
      data: {
        end_date: newEnd,
        period_length: daysBetween(start, newEnd) + 1,
      },
    });
    return;
  }

  const leftEnd = addDays(day, -1);
  const rightStart = addDays(day, 1);
  await db.$transaction([
    db.menstruationLog.update({
      where: { id: covering.id },
      data: {
        end_date: leftEnd,
        period_length: daysBetween(start, leftEnd) + 1,
      },
    }),
    db.menstruationLog.create({
      data: {
        userId,
        start_date: rightStart,
        end_date: covering.end_date,
        period_length: covering.end_date
          ? daysBetween(rightStart, covering.end_date) + 1
          : null,
        source: "MANUAL",
      },
    }),
  ]);
}
