// @Test
// public void createOrder_givenInvalidCustomer_throwsResourceNotFoundException() {
//     // GIVEN: customer does not exist
//     when(customerRepository.findById("1234")).thenReturn(Optional.empty());

//     // WHEN: create order
//     // THEN: CustomerNotFoundException thrown
//     assertThatThrownBy(() -> orderService.createOrder(Order.Status.DRAFT, "1234"))
//             .isExactlyInstanceOf(ResourceNotFoundException.class)
//             .extracting("resourceType", "resourceId").containsExactly(ResourceType.CUSTOMER, "1234");
// }\n\n`;
// //}

export interface CGenColumn {
    table_catalog: string;
    table_name: string;
    column_name: string;
    ordinal_position: string;
    is_nullable: string;
    column_default: string;
    udt_name: string;
    character_maximum_length: string;
    is_identity: string;
    primary: string;
  }
  
  export interface CGenParent {
    basepkg: string;
    table: string;
    entity: string;
    camEntity: string;
    capEntity: string;
  }