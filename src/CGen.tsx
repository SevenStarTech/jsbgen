import React, { useEffect, useState } from 'react';
import './CGen.scss';
import MasterPage from './components/masterPage/MasterPage';
import TitledInput from './components/titledInput/TitledInput';
import Select from 'react-select';
import { CGenColumn } from './CGenTypes';

import CGenEntity from './CGenEntity';
import CGenResponse from './CGenResponse';
import CGenUpdateRequest from './CGenUpdateRequest';
import CGenCreateRequest from './CGenCreateRequest';
import CGenRepository from './CGenRepository';
import CGenHelper from './CGenHelper';
import CGenService from './CGenService';
import CGenController from './CGenController';
import CGenServiceTest from './CGenServiceTest';
import Axios from 'axios';
import Button from './components/button/Button';


export interface SelectOptions {
  label: string;
  value: string;
}

const cgenUrl = 'http://localhost:3333/api/cgen?table=';

const CGen = (): JSX.Element => {
  const connects: string[][] = [];
  let c = -1;
  connects[++c] = [];
  connects[c][0] = 'Connect Template';
  connects[c][1] = 'user:password@host:port/db';
  connects[c][2] = '';

  connects[++c] = [];
  connects[c][0] = 'DVD Rental Sample DB';
  connects[c][1] = 'postgres:postpost@localhost:5432/dvdrental'; // ?currentSchema=offerboard
  connects[c][2] = 'dvd';

  const setting: string[][] = [];
  let i = -1;

  setting[++i] = [];
  setting[i][0] = ''; // Table
  setting[i][1] = ''; // Entity
  setting[i][2] = ''; // RootApi
  setting[i][3] = ''; // Api
  setting[i][4] = ''; // Pkg
  setting[i][5] = ''; // Parents
  setting[i][6] = ''; // Uncles
  setting[i][7] = ''; // Kids
  setting[i][8] = ''; // IncludedKids

  setting[++i] = [];
  setting[i][0] = 'film';
  setting[i][1] = 'film';
  setting[i][2] = '/dvdrental';
  setting[i][3] = '/films';
  setting[i][4] = '.dvdrental';
  setting[i][5] = '@language.language'
  setting[i][6] = '';
  setting[i][7] = '@inventory.inventory';
  setting[i][8] = '';
  setting[i][9] = 'dvdrental';

  setting[++i] = [];
  setting[i][0] = 'people';
  setting[i][1] = 'people';
  setting[i][2] = '/resrouces';
  setting[i][2] = '/people';
  setting[i][3] = 'resources.people';
  setting[i][4] = '';
  setting[i][5] = 'resources.people@people_role.primary_role';
  setting[i][6] =
    'resources.people@people_role,resources.people@available,resources.people@PEOPLE_RESOURCE_PEOPLE.people_resource,resources.people@unavailable_people.unavailable';
  setting[i][7] =
    'resources.people@people_role,resources.people@available,resources.people@PEOPLE_RESOURCE_PEOPLE.people_resource';
  setting[i][9] = 'plan';

  setting[++i] = [];
  setting[i][0] = 'equipment';
  setting[i][1] = 'equipment';
  setting[i][2] = '/assets';
  setting[i][3] = '/equipment';
  setting[i][4] = 'assets';
  setting[i][5] = '';
  setting[i][6] = '';
  setting[i][7] = 'assets@unavailable_equipment';
  setting[i][8] = 'assets@unavailable_equipment';
  setting[i][9] = 'plan';

  setting[++i] = [];
  setting[i][0] = 'schedule_people';
  setting[i][1] = 'schedule_people';
  setting[i][2] = '/assets';
  setting[i][3] = '/schedules';
  setting[i][4] = 'assets.people';
  setting[i][5] = 'assets.people@people';
  setting[i][6] = '';
  setting[i][7] = '';
  setting[i][8] = '';
  setting[i][9] = 'plan';

  setting[++i] = [];
  setting[i][0] = 'schedule_equipment';
  setting[i][1] = 'schedule_equipment';
  setting[i][2] = '/assets';
  setting[i][3] = '/schedules';
  setting[i][4] = 'assets.equipment';
  setting[i][5] = 'assets.equipment@equipment';
  setting[i][6] = '';
  setting[i][7] = '';
  setting[i][8] = '';
  setting[i][9] = 'plan';

  setting[++i] = [];
  setting[i][0] = 'unavailable_equipment';
  setting[i][1] = 'unavailable_equipment';
  setting[i][2] = '/assets';
  setting[i][3] = '/unavailable';
  setting[i][4] = 'assets';
  setting[i][5] = 'assets@equipment';
  setting[i][6] = '';
  setting[i][7] = '';
  setting[i][8] = '';
  setting[i][9] = 'plan';

  setting[++i] = [];
  setting[i][0] = 'plan_order';
  setting[i][1] = 'order';
  setting[i][2] = '/planning/order';
  setting[i][3] = '';
  setting[i][4] = 'planning';
  setting[i][5] = '';
  setting[i][6] = '';
  setting[i][7] = 'planning@plan_job.job';
  setting[i][8] = 'planning@plan_job.job';
  setting[i][9] = 'plan';

  setting[++i] = [];
  setting[i][0] = 'plan_job';
  setting[i][1] = 'job';
  setting[i][2] = '/planning/job';
  setting[i][3] = '';
  setting[i][4] = 'planning';
  setting[i][5] = 'planning@plan_order.order';
  setting[i][6] = '';
  setting[i][7] = 'planning@plan_job_service.job_service';
  setting[i][8] = 'planning@plan_job_service.job_service';
  setting[i][9] = 'plan';

  setting[++i] = [];
  setting[i][0] = 'plan_job_service';
  setting[i][1] = 'job_service';
  setting[i][2] = '/planning/job/{jobId}';
  setting[i][3] = '/services';
  setting[i][4] = 'planning';
  setting[i][5] = 'planning@plan_job.job';
  setting[i][6] = '';
  setting[i][7] = '';
  setting[i][8] = '';
  setting[i][9] = 'plan';

  setting[++i] = [];
  setting[i][0] = 'address';
  setting[i][1] = 'address';
  setting[i][2] = '/orders/{orderId}';
  setting[i][3] = '/addresses/{addressId}';
  setting[i][4] = '';
  setting[i][5] = '@order';
  setting[i][6] = '';
  setting[i][7] = '';
  setting[i][8] = '';
  setting[i][9] = 'plan';

  const getConnectUser = (connect: string):string => {
    const leftside = connect?.split('@')?.[0] || ''
    return leftside?.split(':')?.[0]
  }

  const getConnectPassword = (connect: string):string => {
    const leftside = connect?.split('@')?.[0] || ''
    return leftside?.split(':')?.[1] || ''
  }  

  const getConnectServer = (connect: string):string => {
    return connect?.split('@')?.[1] || ''
  }  

  const [connectIdx, setConnectIdx] = useState(1);
  const [connect, setConnect] = useState(connects[connectIdx][1]);
  const [connectUser, setConnectUser] = useState(getConnectUser(connects[connectIdx][1]));
  const [connectPassword, setConnectPassword] = useState(getConnectPassword(connects[connectIdx][1]));
  const [connectServer, setConnectServer] = useState(getConnectServer(connects[connectIdx][1]));
  const [setIdx, setSetIdx] = useState(0);
  const [table, setTable] = useState(setting[setIdx][0]);
  const [entity, setEntity] = useState(setting[setIdx][1]);
  const [rootApi, setRootApi] = useState(setting[setIdx][2]);
  const [api, setApi] = useState(setting[setIdx][3]);
  const [pkg, setPkg] = useState(setting[setIdx][4]);
  const [parents, setParents] = useState(setting[setIdx][5]);
  const [uncles, setUncles] = useState(setting[setIdx][6]);
  const [kids, setKids] = useState(setting[setIdx][7]);
  const [includedKids, setIncludedKids] = useState(setting[setIdx][8]);

  const [columns, setColumns] = useState<CGenColumn[]>([]);

  const getColumns = (table: string): Promise<CGenColumn[]> => {
    // postgres:postpost@localhost:5432/convergeplanningd
    return Axios(cgenUrl + table + '&connect=' + connectUser + ':' + connectPassword + '@' + connectServer).then(
      ({ data }: { data: CGenColumn[] }) => data,
    );
  };

  const generateCode = (): void => {
    if (table) {
      getColumns(table).then(data => {
        setColumns(data);
      });
    }
  };

  const generateCodeWithSetState = (): void => {
    if (setting[setIdx][0]) {
      setTable(setting[setIdx][0]);
      setEntity(setting[setIdx][1]);
      setRootApi(setting[setIdx][2]);
      setApi(setting[setIdx][3]);
      setPkg(setting[setIdx][4]);
      setParents(setting[setIdx][5]);
      setUncles(setting[setIdx][6]);
      setKids(setting[setIdx][7]);
      setIncludedKids(setting[setIdx][8]);

      getColumns(setting[setIdx][0]).then(data => {
        setColumns(data);
      });
    } else {
      setTable(setting[setIdx][0]);
      setEntity(setting[setIdx][1]);
      setRootApi(setting[setIdx][2]);
      setApi(setting[setIdx][3]);
      setPkg(setting[setIdx][4]);
      setParents(setting[setIdx][5]);
      setUncles(setting[setIdx][6]);
      setKids(setting[setIdx][7]);
      setIncludedKids(setting[setIdx][8]);
    }
  };

  // useEffect(() => {
  //   debugger;
  // }, [columns]);

  useEffect(() => {
    generateCodeWithSetState();
  }, [setIdx]);

  useEffect(() => {
    const connectStr = connects[connectIdx][1]
    setConnect(connectStr);
    setConnectUser(getConnectUser(connectStr));
    setConnectPassword(getConnectPassword(connectStr));
    setConnectServer(getConnectServer(connectStr));      
  }, [connectIdx]);

  // useEffect(() => {
  //   if (!api) {
  //     setApi('/' + entity + 's');
  //   }
  // }, [entity]);

  const ddConnects: SelectOptions[] = connects.map((connect, idx) => {
    let sel: SelectOptions = {
      value: idx.toString(),
      label: connect[0],
    };
    return sel;
  });

  const ddSettings: SelectOptions[] = setting.map((table, idx) => {
    let sel: SelectOptions = {
      value: idx.toString(),
      label: table[0],
    };
    return sel;
  });

  return (
    <MasterPage
      title={
        <div className="codegentitle">
          {/* <img height="35" src={Logo} /> */}
          &nbsp;&nbsp;Java Spring Boot Code Generator
        </div>
      }
      leftBarContent={
        <div className="codegen_master" style={{ padding: '32px' }}>
          <div className="title-style unfocused">PRE_DEFINED CONNECTIONS</div>
          <Select
            options={ddConnects}
            // className={styles[`select-filter`]}
            value={ddConnects[connectIdx]}
            onChange={selection => {
              if (selection) {
                let sel = selection as SelectOptions;
                if (sel.value) {
                  setConnectIdx(parseInt(sel.value));             
                }
              }
            }}
          />
          <br />
          <TitledInput
            width="100%"
            title="POSTGRES USER"
            text={connectUser}
            onChange={setConnectUser}
          />
          <TitledInput
            width="100%"
            title="PASSWORD"
            text={connectPassword}
            onChange={setConnectPassword}
          />                    
          <TitledInput
            width="100%"
            title="HOST:PORT/DB"
            text={connectServer}
            onChange={setConnectServer}
          />
          <Button
            text="GENERATE CODE"
            // color="primary"
            // variant="contained"
            onClick={generateCode}
          />
          <div className="title-style unfocused">
            PRE-DEFINED TABLE PARAMETERS
          </div>
          <Select
            options={ddSettings}
            // className={styles[`select-filter`]}
            value={ddSettings[setIdx]}
            onChange={selection => {
              if (selection) {
                let sel = selection as SelectOptions;
                if (sel.value) {
                  setSetIdx(parseInt(sel.value));
                }
              }
            }}
          />
          <br />
          <TitledInput
            width="100%"
            title="Base Package"
            text={pkg}
            onChange={setPkg}
          />
          <TitledInput
            width="100%"
            title="Table"
            text={table}
            onChange={setTable}
          />
          <TitledInput
            width="100%"
            title="Entity"
            text={entity}
            onChange={setEntity}
          />
          <TitledInput
            width="100%"
            title="Root API"
            text={rootApi}
            onChange={setRootApi}
          />
          <TitledInput
            width="100%"
            title="Entity API"
            text={api}
            onChange={setApi}
          />
          <TitledInput
            width="100%"
            title="Parent(s) :: BASEPKG@TABLE{.ENTITY}..."
            text={parents}
            onChange={setParents}
            rows={3}
          />
          <TitledInput
            width="100%"
            title="Foreign Key(s) :: BASEPKG@TABLE{.ENTITY}..."
            text={uncles}
            onChange={setUncles}
            rows={3}
          />
          <TitledInput
            width="100%"
            title="Children :: BASEPKG@TABLE{.ENTITY}..."
            text={kids}
            onChange={setKids}
            rows={3}
          />
          <TitledInput
            width="100%"
            title="Response Children :: BASEPKG@TABLE{.ENTITY}..."
            text={includedKids}
            onChange={setIncludedKids}
            rows={3}
          />
        </div>
      }
    >
      <div className="codegen_master">
        <CGenEntity
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
        />
        <CGenResponse
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
        />
        <CGenCreateRequest
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
        />
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
        />
        <CGenRepository
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
        />
        <CGenHelper
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
        />
        <CGenService
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
        />
        <CGenController
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
        />
        <CGenServiceTest
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
        />
      </div>
    </MasterPage>
  );
};

export default CGen;