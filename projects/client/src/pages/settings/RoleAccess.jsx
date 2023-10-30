import React, { useState } from "react";
import Table3 from "../../components/Table3";
import TableBodyWithIcon from "../../components/TableBodyWithIcon";
import AddDataHeader from "../../components/AddDataHeader";
import SearchBar from "../../components/SearchBar";
import ModalForm from "../../components/Modal";

const RoleAccess = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div>
      <ModalForm
        title="List Role Access"
        action="Add"
        open={openModal}
        setOpen={setOpenModal}
      />
      <div>
        <AddDataHeader
          title="Role Access"
          desc="A list Role Acces Quantum Nusatama"
          addButtonText="Add Role Access"
          onAddClick={() => {
            setOpenModal(true);
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 mt-12 border-b border-gray-200">
          <SearchBar />
        </div>
        <div></div>
        <Table3
          headCols={["Role Name", "Status", "Action"]}
          tableBody={<TableBodyWithIcon />}
        />
      </div>
    </div>
  );
};

export default RoleAccess;
