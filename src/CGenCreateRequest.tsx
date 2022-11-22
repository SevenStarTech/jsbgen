import React, { useEffect, useState } from "react";
import { CGenColumn } from "./CGenTypes";
import CGenUpdateRequest from "./CGenUpdateRequest";

const CGenCreateRequest = ({
  table,
  entity,
  columns,
  rootApi,
  api,
  pkg,
  parents,
  uncles,
  kids,
  includedKids,
}: {
  table: string;
  entity: string;
  columns: CGenColumn[];
  rootApi: string;
  api: string;
  pkg: string;
  parents: string;
  uncles: string;
  kids: string;
  includedKids: string;
}): JSX.Element => (
  <CGenUpdateRequest
    table={table}
    entity={entity}
    columns={columns}
    rootApi={rootApi}
    api={api}
    pkg={pkg}
    parents={parents}
    uncles={uncles}
    kids={kids}
    includedKids={includedKids}
    forCreate={true}
  />
);

export default CGenCreateRequest;