/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { create } from "zustand";
import { formatYear } from "../util/formatDateRange";

const URI = "https://api.artic.edu/api/v1/artworks";

export interface DataSet {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
  isSelected: boolean;
}

type Store = {
  data: DataSet[];
  selectedRows: DataSet[];
  selectedId: number[];
  page: number;
  fetchData: () => Promise<void>;
  toggleSelectionRows: (rowData: DataSet) => void;
  setPage: (page: number) => void;
  selectRowsInRange: (idFrom: number, idTo: number) => void;
  unSelectRowsInRange: (idFrom: number, idTo: number) => void;
  refreshSelectedRows: () => void;
};

export const useStore = create<Store>((set, get) => ({
  data: [],
  selectedRows: [],
  selectedId: [],
  page: 1,

  fetchData: async () => {
    const page = get().page;
    const res = await axios.get(`${URI}?page=${page}`);
    const fetchedData = res.data.data;
    const selectedId = get().selectedId;

    const formattedData = fetchedData.map((item: any, index: number) => {
      const id = (page - 1) * 12 + index + 1;
      return {
        ...item,
        id,
        date_start: formatYear(item.date_start),
        date_end: formatYear(item.date_end),
      };
    });
    const selectedRows = formattedData.filter((item: any) =>
      selectedId.includes(item.id)
    );
    set({ selectedRows });

    set({ data: formattedData });
    get().refreshSelectedRows();
  },
  selectRowsInRange: (idFrom: number, idTo: number) => {
    let selectedId = get().selectedId;

    const rangeIds = Array.from(
      { length: Math.abs(idTo - idFrom) + 1 },
      (_, i) => Math.min(idFrom, idTo) + i
    );
    const newSet = new Set([...selectedId, ...rangeIds]);
    selectedId = Array.from(newSet);

    set({ selectedId });
    get().refreshSelectedRows();
  },
  unSelectRowsInRange: (idFrom: number, idTo: number) => {
    let selectedId = get().selectedId;
    selectedId = selectedId.filter((id) => id < idFrom && id > idTo);

    set({ selectedId });
    get().refreshSelectedRows();
  },
  toggleSelectionRows: (rowData: DataSet) => {
    let selectedId = get().selectedId;
    let selectedRows = get().selectedRows;
    const id = rowData.id;

    if (selectedId.includes(id)) {
      selectedId = selectedId.filter((item) => item != id);
      selectedRows = selectedRows.filter((item) => item.id != id);
    } else {
      selectedId.push(id);
      selectedRows.push(rowData);
    }

    set({ selectedId, selectedRows });
  },
  setPage: async (page: number) => {
    set({ page });
    get().fetchData();
  },

  refreshSelectedRows: () => {
    const data = get().data;
    const selectedId = get().selectedId;

    const selectedRows = data.filter((item) => selectedId.includes(item.id));
    set({ selectedRows });
  },
}));
