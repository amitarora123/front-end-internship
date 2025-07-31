/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-expect-ignore

import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useStore } from "../store/store";
import { Paginator } from "primereact/paginator";
import { FaCheck } from "react-icons/fa";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { BsX } from "react-icons/bs";

export default function TemplateDemo() {
  const {
    fetchData,
    setPage,
    toggleSelectionRows,
    selectRowsInRange,
    unSelectRowsInRange,
    selectedRows,
    data,
  } = useStore();

  const [first, setFirst] = useState<number>(1);
  const [allRowsSelected, setAllRowsSelected] = useState<boolean>(false);
  const rowsPerPage = 12;
  const [from, setFrom] = useState(first);
  const [to, setTo] = useState(first + 11);

  const onPageChange = (event: any) => {
    setFirst(event.first);
    const pageNumber = Math.floor(event.first / event.rows) + 1;
    setPage(pageNumber);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const op = useRef<OverlayPanel>(null);

  return (
    <div className="card">
      {data && (
        <>
          <DataTable
            value={data}
            selectionMode="multiple"
            selection={selectedRows}
            selectAll={selectedRows.length === data.length}
            onSelectAllChange={() => {
              if (allRowsSelected) {
                unSelectRowsInRange(first, first + 12);
              } else {
                selectRowsInRange(first, first + 12);
              }
              setAllRowsSelected((prev) => !prev);
            }}
            onRowSelect={(e) => {
              toggleSelectionRows(e.data);
            }}
            onRowUnselect={(e) => {
              toggleSelectionRows(e.data);
            }}
            dataKey="id"
            tableStyle={{ minWidth: "60rem" }}
          >
            <Column
              selectionMode="multiple"
              header={() => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    margin: "5px",
                  }}
                >
                  // @ts-ignore
                  <FaCheck onClick={(e) => op.current?.toggle(e)} />
                  <OverlayPanel ref={op}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 20,
                        position: "relative",
                      }}
                    >
                      <BsX
                        style={{
                          position: "absolute",
                          top: "0px",
                          right: "0px",
                          width: "2rem",
                          height: "2rem",
                          cursor: "pointer",
                        }}
                        onClick={(e) => op.current?.toggle(e)}
                      />
                      <div>
                        <div>
                          <p>From: </p>
                          <input
                            type="number"
                            value={from}
                            onChange={(e) => setFrom(Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <p>To: </p>
                          <input
                            type="number"
                            value={to}
                            onChange={(e) => setTo(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => selectRowsInRange(from, to)}
                      style={{ marginTop: "20px" }}
                    >
                      Submit
                    </Button>
                  </OverlayPanel>
                </div>
              )}
              headerStyle={{ width: "5rem" }}
            />

            <Column field="id" header="Sr No." />
            <Column field="title" header="Title" />
            <Column field="artist_display" header="Artist" />
            <Column field="place_of_origin" header="Place of Origin" />
            <Column field="inscriptions" header="Inscriptions" />
            <Column field="date_start" header="Start Date" />
            <Column field="date_end" header="End Date" />
          </DataTable>

          <div className="card">
            <Paginator
              first={first}
              rows={rowsPerPage}
              totalRecords={129355}
              onPageChange={onPageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
