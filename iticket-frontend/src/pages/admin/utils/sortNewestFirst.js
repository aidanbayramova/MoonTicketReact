const getIdValue = (item) => {
  const id = item?.id ?? item?.Id ?? item?.ID ?? 0;
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getDateValue = (item) => {
  const dateValue =
    item?.createdDate ??
    item?.CreatedDate ??
    item?.createdAt ??
    item?.CreatedAt ??
    item?.date ??
    item?.Date ??
    item?.startDate ??
    item?.StartDate;

  if (!dateValue) return null;
  const ts = new Date(dateValue).getTime();
  return Number.isNaN(ts) ? null : ts;
};

export function sortNewestFirst(list) {
  if (!Array.isArray(list)) return [];

  return [...list].sort((a, b) => {
    const dateA = getDateValue(a);
    const dateB = getDateValue(b);

    if (dateA !== null && dateB !== null && dateA !== dateB) {
      return dateB - dateA;
    }

    return getIdValue(b) - getIdValue(a);
  });
}
