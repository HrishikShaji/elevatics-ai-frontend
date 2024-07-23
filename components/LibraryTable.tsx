import Tippy from "@tippyjs/react";
import { sortBy } from "lodash";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import IconPencil from "./icon/icon-pencil";
import IconTrashLines from "./icon/icon-trash-lines";

export default function LibraryTable() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const PAGE_SIZES = [10, 20, 30, 50, 100];



    const [page2, setPage2] = useState(1);
    const [pageSize2, setPageSize2] = useState(PAGE_SIZES[0]);
    const [initialRecords2, setInitialRecords2] = useState(sortBy(rowData, 'firstName'));
    const [recordsData2, setRecordsData2] = useState(initialRecords2);

    const [search2, setSearch2] = useState('');
    const [sortStatus2, setSortStatus2] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    useEffect(() => {
        setPage2(1);
    }, [pageSize2]);

    useEffect(() => {
        const from = (page2 - 1) * pageSize2;
        const to = from + pageSize2;
        setRecordsData2([...initialRecords2.slice(from, to)]);
    }, [page2, pageSize2, initialRecords2]);

    useEffect(() => {
        setInitialRecords2(() => {
            return rowData.filter((item: any) => {
                return (
                    item.firstName.toLowerCase().includes(search2.toLowerCase()) ||
                    item.company.toLowerCase().includes(search2.toLowerCase()) ||
                    item.age.toString().toLowerCase().includes(search2.toLowerCase()) ||
                    item.dob.toLowerCase().includes(search2.toLowerCase()) ||
                    item.email.toLowerCase().includes(search2.toLowerCase()) ||
                    item.phone.toLowerCase().includes(search2.toLowerCase())
                );
            });
        });
    }, [search2]);

    useEffect(() => {
        const data2 = sortBy(initialRecords2, sortStatus2.columnAccessor);
        setInitialRecords2(sortStatus2.direction === 'desc' ? data2.reverse() : data2);
    }, [sortStatus2]);

    const formatDate = (date: string | number | Date) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };

    const randomColor = () => {
        const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
        const random = Math.floor(Math.random() * color.length);
        return color[random];
    };

    const randomStatus = () => {
        const status = ['PAID', 'APPROVED', 'FAILED', 'CANCEL', 'SUCCESS', 'PENDING', 'COMPLETE'];
        const random = Math.floor(Math.random() * status.length);
        return status[random];
    };

    return (
        <>

            <div className="panel mt-6">
                <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                    <h5 className="text-lg font-semibold dark:text-white-light">Table 2</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search2} onChange={(e) => setSearch2(e.target.value)} />
                    </div>
                </div>
                <div className="datatables">
                    {isMounted && (
                        <DataTable
                            className="table-hover whitespace-nowrap"
                            records={recordsData2}
                            columns={[
                                {
                                    accessor: 'firstName',
                                    title: 'Name',
                                    sortable: true,
                                    render: ({ firstName, lastName, id }) => (
                                        <div className="flex w-max items-center">
                                            <img className="h-9 w-9 rounded-full object-cover ltr:mr-2 rtl:ml-2" src={`/assets/images/profile-${id}.jpeg`} alt="" />
                                            <div>{firstName + ' ' + lastName}</div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'age',
                                    title: 'Age',
                                    sortable: true,
                                    render: ({ age }) => (
                                        <div className="flex h-2.5 w-4/5 min-w-[100px] rounded-full bg-[#ebedf2] dark:bg-dark/40">
                                            <div className={`h-2.5 rounded-full rounded-bl-full text-center text-xs text-white bg-${randomColor()}`} style={{ width: `${age}%` }}></div>
                                        </div>
                                    ),
                                },
                                { accessor: 'company', title: 'Company', sortable: true },
                                {
                                    accessor: 'dob',
                                    title: 'Start Date',
                                    sortable: true,
                                    render: ({ dob }) => <div>{formatDate(dob)}</div>,
                                },
                                { accessor: 'email', title: 'Email', sortable: true },
                                { accessor: 'phone', title: 'Phone No.', sortable: true },
                                {
                                    accessor: 'action',
                                    title: 'Action',
                                    titleClassName: '!text-center',
                                    render: () => (
                                        <div className="mx-auto flex w-max items-center gap-2">
                                            <Tippy content="Edit">
                                                <IconPencil />
                                            </Tippy>
                                            <Tippy content="Delete">
                                                <IconTrashLines />
                                            </Tippy>
                                        </div>
                                    ),
                                },
                            ]}
                            totalRecords={initialRecords2.length}
                            recordsPerPage={pageSize2}
                            page={page2}
                            onPageChange={(p) => setPage2(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize2}
                            sortStatus={sortStatus2}
                            onSortStatusChange={setSortStatus2}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        />
                    )}
                </div>
            </div>
        </>

    )
}
