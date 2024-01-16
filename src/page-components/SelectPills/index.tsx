import React, { useEffect, useState } from "react";
import styles from './styles.module.css';

interface DataItem {
    id: number;
    name: string;
    email: string;
  }
interface chipId {
    id:number;
}

const SelectPills: React.FC<{ data: DataItem[] }> = (props) => {
    const {data}=props ||{};
    const [chipClick, setChipClick] = useState<chipId>();
    const [clicked, setClicked] = useState<boolean>(false);
    const [options, setOptions] = useState<DataItem[]>(data);
    const [selectedOptions, setSelectedOptions] = useState<DataItem[]>([]);
    const [search, setSearch] = useState<string>('');

    const isEmpty = (val:DataItem[]) => val?.length === 0;

    const handleClick = (item) => {
        const newOptions = (options || [])?.filter((val) => val?.id !== item?.id)
        setOptions(newOptions);
        setSelectedOptions([...selectedOptions, item]);
        setChipClick(item);
        setSearch('');
    }

    const handleCross = (item, e) => {
        e.stopPropagation();
        const newSelectedOptions = selectedOptions?.filter((val) => val?.id !== item?.id);
        const selectedIds = newSelectedOptions?.map((val) => val?.id);
        const newOptions = data?.filter((val) => !selectedIds?.includes(val?.id));
        setSelectedOptions(newSelectedOptions);
        setOptions(newOptions);
        setSearch('');
    }

    const handleDropDown = (e) => {
        e.stopPropagation(); 
        setClicked((prev) => !prev);
        setSearch('');
    }

    const handleChipClick = (item, e) => {
        e.stopPropagation(); 
        setChipClick(item);
        setSearch('');
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e?.key === "Backspace" && search === "" && selectedOptions.length > 0) {
            if(chipClick?.id) {
                const newSelectedOptions = selectedOptions.slice(0, -1);
                const selectedIds = newSelectedOptions?.map((item) => item?.id);
                const newOptions = (data || [])?.filter((item) => !selectedIds?.includes(item?.id));
                setOptions(newOptions);
                setSelectedOptions(newSelectedOptions);
                setChipClick({id: 0});
            } else {
                setChipClick(selectedOptions[selectedOptions.length - 1]);
            }
        }
    };

    useEffect(() => {
        const debounceSearch = () => {
            const selectedIds = selectedOptions?.map((item) => item?.id);
            const newOptions = (data || [])?.filter((item) => !selectedIds?.includes(item?.id) && item?.name?.toLowerCase().includes(search?.toLowerCase()));
            setOptions(newOptions);
        };
        const timer = setTimeout(debounceSearch, 600); 

        return () => {
            clearTimeout(timer);
        };
    }, [search, data, selectedOptions]);

    return (
    <div className={styles.container}>
        <div className={styles.upper_container} onClick={() => setChipClick({id: 0})}>
            <div className={styles.option_container}>
                {(selectedOptions || []).map((item) => {
                    return (
                    <div
                        key={item?.id} 
                        className={`${styles.chip} ${chipClick?.id === item?.id ? styles.chip_click : ''}`} 
                        onClick={(e) => handleChipClick(item, e)}
                    >
                        <div className={styles.chip_left}>{item?.name}</div>
                        <div className={styles.chip_right} onClick={(e) => handleCross(item, e)}>X</div>
                    </div>)
                })}
                <input 
                    className={styles.input_field} 
                    placeholder="Add items" 
                    type='text' 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    onClick={() => setClicked(true)}
                    onKeyDown={handleInputKeyDown}
                />
            </div>
            <div onClick={(e) => handleDropDown(e)} 
                className={`${styles.drop_down_icon} ${clicked ? styles.cliked_dropdown_icon : ''}`}
            >V</div>
        </div>
        {clicked ? <div className={styles.lower_container}>
            {isEmpty(options) ? <div className={styles.empty_state}>No options to show</div> :
            (options || []).map((item) => {
                return (
                    <div key={item?.id} className={styles.option} onClick={() => handleClick(item)}>
                        <div>{item?.name}</div>
                        <div>{item?.email}</div>
                    </div>
                )
            })
            }
        </div> : null}
    </div>
    )
}

export default SelectPills;