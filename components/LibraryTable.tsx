import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import IconPencil from "./icon/icon-pencil";
import { Report, ReportType } from "@prisma/client";
import { IoDocumentTextOutline } from "react-icons/io5";
import DeleteReport from "./DeleteReport";
import Link from "next/link";
import CustomDropdown from "./CustomDropdown";

interface LibraryTableProps {
    rowData: Report[]
}

export default function LibraryTable({ rowData }: LibraryTableProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [currentType, setCurrentType] = useState("");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const PAGE_SIZES = [10, 20, 30, 50, 100];

    const typeOptions: { title: string, value: ReportType | "" }[] = [
        { title: "All", value: "" },
        { title: "Quick", value: "QUICK" },
        { title: "Full", value: "FULL" },
        { title: "Investor", value: "INVESTOR" },
        { title: "News", value: "NEWS" },
        { title: "Code", value: "CODE" }
    ];

    function getValue(value: string | number) {
        const item = typeOptions.find((item) => item.value === value)
        if (item) {
            return item.title
        } else {
            return "Invalid Entry"
        }
    }

    function typeChange(value: string | number) {
        setPage(1)
        setCurrentType(value as string);
    }

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'firstName'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return rowData.filter((item: Report) => {
                const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
                const matchesType = currentType === '' || item.reportType === currentType;
                return matchesSearch && matchesType;
            });
        });
    }, [search, rowData, currentType]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);

    const formatDate = (date: string | number | Date) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };

    return (
        <div className="p-10">
            <div className="mb-5 flex flex-col gap-5 md:flex-row justify-end md:items-center">
                <div className="ltr:ml-auto flex items-center gap-5 rtl:mr-auto">
                    <CustomDropdown label="" options={typeOptions} value={getValue(currentType)} onChange={typeChange} />
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="datatables">
                {isMounted && (
                    <DataTable
                        className="table-hover whitespace-nowrap"
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'no',
                                title: "ID",
                                sortable: false,
                                render: (value, row) => <div>{(row + 1) + (page - 1) * pageSize}</div>,
                            },
                            {
                                accessor: 'query',
                                title: 'Query',
                                sortable: false,
                                render: ({ name, id }) => (
                                    <div className="flex w-max items-center">
                                        {name}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'date',
                                title: 'Date',
                                sortable: true,
                                render: ({ createdAt }) => <div>{formatDate(createdAt)}</div>,
                            },
                            {
                                accessor: 'type',
                                title: 'Type',
                                sortable: false,
                                render: ({ reportType }) => <div>{reportType}</div>,
                            },
                            {
                                accessor: 'action',
                                title: 'Action',
                                titleClassName: '!text-center',
                                render: ({ id }) => (
                                    <div className="mx-auto flex w-max items-center gap-2">
                                        <Link href={`${process.env.NEXT_PUBLIC_URL}/saved/${id}`}>
                                            <IoDocumentTextOutline size={20} />
                                        </Link>
                                        <IconPencil />
                                        <DeleteReport id={id} />
                                    </div>
                                ),
                            },
                        ]}
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                )}
            </div>
        </div>
    );
}
