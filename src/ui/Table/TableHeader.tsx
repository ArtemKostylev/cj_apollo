import {Header} from './style/Header.styled';
import React, {memo} from 'react';
import {headerMap} from './TableRow/componentMap';

interface Props<T extends PrimitiveCacheEntity> {
  rowInfo: RowInfo<T>
}


export const TableHeader = memo(<T extends PrimitiveCacheEntity>({rowInfo}: Props<T>) => {
  return (
    <tr>
      {Object.values(rowInfo).map(it => {
        const Component = headerMap[it.type] || Header;
        return <Component width={it.width} rowSpan={it.rowSpan || 1}>{it.label}</Component>
      })}
    </tr>
  )
})