import { JournalForm } from "@/components/journal-form";

interface Props {
  params: Promise<{ date: string }>;
}

export default async function JurnalDatePage({ params }: Props) {
  const { date } = await params;
  const displayDate = decodeURIComponent(date).toUpperCase().replace(/-/g, ", ");

  return (
    <JournalForm
      date={displayDate}
      initialMood="sad"
      initialSymptoms={["Sedih", "Kram"]}
      backHref="/jurnal"
    />
  );
}
