import { isStringTypeAnnotation } from '@babel/types';
import { CGenColumn, CGenParent } from './CGenTypes';
import { saveAs } from './FileSaver';

const c = {
  super_root(): string {
    return 'com.company.division.software';
  },

  camelCase(inVal: string): string {
    let s = '';
    if (inVal) {
      let vals = inVal.split('_');
      vals.map((v, idx) => {
        if (idx === 0) {
          s += v.toLowerCase();
        } else {
          s += v.substr(0, 1).toUpperCase() + v.substr(1).toLowerCase();
        }
      });
    }
    return s;
  },

  capitalCase(inVal: string): string {
    let s = '';
    if (inVal) {
      let vals = inVal.split('_');
      vals.map((v, idx) => {
        s += v.substr(0, 1).toUpperCase() + v.substr(1).toLowerCase();
      });
    }
    return s;
  },

  humanCase(inVal: string): string {
    let s = '';
    if (inVal) {
      let vals = inVal.split('_');
      vals.map((v, idx) => {
        if (s) {
          s += ' ';
        }
        s += v.substr(0, 1).toUpperCase() + v.substr(1).toLowerCase();
      });
    }
    return s;
  },

  replaceDotsWithDashes(inVal: string): string {
    return inVal.replace('.', '_');
  },

  getColumnType(coltype: string, colname: string): string {
    if (coltype === 'varchar') {
      return 'String';
    } else if (coltype === 'int4') {
      return 'Long';
    } else if (coltype === 'int8') {
      return 'Long';
    } else if (coltype === 'timestamptz') {
      return 'String';
    } else if (coltype === 'date') {
      return 'LocalDate';
    } else if (coltype === 'time') {
      return 'OffsetTime';
    } else if (coltype === 'numeric') {
      if (colname.toLowerCase().indexOf('cents') >= 0) {
        return 'BigInteger';
      } else if (
        colname.toLowerCase().indexOf('price') >= 0 ||
        colname.toLowerCase().indexOf('cost') >= 0
      ) {
        return 'BigDecimal';
      } else {
        return 'Integer';
      }
    } else {
      return 'String';
    }
  },

  getNotEmptyText(col: CGenColumn, withMessage: boolean): string {
    if (
      col.is_nullable === 'NO' ||
      col.primary === 'YES' ||
      col.column_name === 'tenant_id'
    ) {
      if (col.udt_name === 'varchar') {
        if (withMessage) {
          return (
            `  @NotEmpty(message = "The ${c.humanCase(
              col.column_name,
            )} for this ${c.humanCase(
              col.table_name,
            )} cannot be null or empty.")` + '\n'
          );
        } else {
          return `  @NotEmpty` + '\n';
        }
      } else {
        if (withMessage) {
          return (
            `  @NotNull(message = "The ${c.humanCase(
              col.column_name,
            )} for this ${c.humanCase(col.table_name)} cannot be null.")` + '\n'
          );
        } else {
          return `  @NotNull` + '\n';
        }
      }
    } else {
      // not nullable
      return '';
    }
  },

  isAuditColumn(colname: string): boolean {
    if (colname === 'created_by') {
      return true;
    } else if (colname === 'created_by') {
      return true;
    } else if (colname === 'created_date') {
      return true;
    } else if (colname === 'updated_by') {
      return true;
    } else if (colname === 'updated_date') {
      return true;
    } else if (colname === 'version') {
      return true;
    } else {
      return false;
    }
  },

  isIdForParent(
    colname: string,
    parents: string,
  ): { found: boolean; parent: string } {
    let ans = { found: false, parent: '' };
    if (colname.toLowerCase().indexOf('id') >= 0) {
      // an id column
      if (parents) {
        let parentarray: string[] = parents.split(',');
        parentarray.forEach(parent => {
          if (parent.indexOf('.') >= 0) {
            let pte = c.splitPackageTableEntity(parent);
            if (colname.toLowerCase().indexOf(pte.table.toLowerCase()) >= 0) {
              ans.found = true;
              ans.parent = parent;
            } else if (
              colname.toLowerCase().indexOf(pte.entity.toLowerCase()) >= 0
            ) {
              ans.found = true;
              ans.parent = parent;
            }
          }
        });
      }
    }
    return ans;
  },

  splitPackageTableEntity(it: string): CGenParent {
    let ans: CGenParent = {
      basepkg: '',
      table: '',
      entity: '',
      camEntity: '',
      capEntity: '',
    };
    if (it) {
      let pkgArray = it.split('@');
      ans.basepkg = pkgArray[0];
      if (pkgArray[1]) {
        let itArray = pkgArray[1].split('.');
        ans.table = itArray[0];
        ans.entity = itArray[1];
        if (!ans.entity) {
          ans.entity = ans.table;
        }
        ans.camEntity = this.camelCase(ans.entity);
        ans.capEntity = this.capitalCase(ans.entity);
      }
    }
    return ans;
  },

  getTestData(col: CGenColumn, index: number) {
    switch (c.getColumnType(col.udt_name, col.column_name)) {
      case 'Long':
        return (11111 * index).toString();
      case 'BigInteger':
        return (11111 * index).toString();
      case 'Integer':
        return (11111 * index).toString();
      case 'BigDecimal':
        return `BigDecimal.valueOf(` + (11111.11 * index).toString() + `)`;
      case 'OffsetTime':
        return `OffsetTime.now()`;
      case 'LocalDate':
        return `LocalDate.now()`;
      default:
        // string
        return `"` + index.toString() + `ZZZZZZZZZZZZZZZZZZZZ"`;
    }
  },

  saveFile(fileName: string, content: string): void {
    if (content) {
      var blob = new Blob([content], {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(blob, fileName);
    }
  },
};
export default c;