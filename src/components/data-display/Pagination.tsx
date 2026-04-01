import React from 'react';
import { Pagination, ButtonGroup, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationProps {
    count: number;
    pageSize: number;
    page: number;
    onPageChange: (page: number) => void;
}

function PaginationComponent({ count, pageSize, page, onPageChange }: PaginationProps) {

    const changePage = (details: { page: number }) => {
        onPageChange(details.page - 1); // Convert from 1-based to 0-based
    };

    return (
        <Pagination.Root
            count={count}
            pageSize={pageSize}
            page={page + 1} // Convert from 0-based to 1-based
            onPageChange={changePage}
        >
            <ButtonGroup variant="outline" size="sm">
                <Pagination.PrevTrigger asChild>
                    <IconButton>
                        <LuChevronLeft />
                    </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                    render={(pageItem) => (
                        <IconButton variant={pageItem.type === "page" && pageItem.value === page + 1 ? "solid" : "outline"}>
                            {pageItem.value}
                        </IconButton>
                    )}
                />

                <Pagination.NextTrigger asChild>
                    <IconButton>
                        <LuChevronRight />
                    </IconButton>
                </Pagination.NextTrigger>
            </ButtonGroup>
        </Pagination.Root>
    );
}

export default PaginationComponent;