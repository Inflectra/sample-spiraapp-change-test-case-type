onPageLoad();

/**
 * Set up details page event handlers
 */
function onPageLoad() {
    // Register callbacks for page loading
    spiraAppManager.registerEvent_loaded(() => {
		if (SpiraAppSettings && SpiraAppSettings[APP_GUID]) {
			let customProperty = SpiraAppSettings[APP_GUID].testcase_custom_property;

			//Register the event handler on this 
			let fieldName = 'Custom_' + customProperty.padStart(2, '0');
			spiraAppManager.registerEvent_dropdownChanged(fieldName, (oldVal, newVal) => {
				// do this in a timeout so that we can get the correct value
				setTimeout(() => {
					if (SpiraAppSettings && SpiraAppSettings[APP_GUID]) {
						let customPropertyText = SpiraAppSettings[APP_GUID].testcase_custom_property_value;
						let testCaseTypeText = SpiraAppSettings[APP_GUID].testcase_type_value;
						let fieldName = 'Custom_' + customProperty.padStart(2, '0');

						//See if we have a match
						var selectedItem = spiraAppManager.getLiveFormFieldValue(fieldName);
						if (selectedItem.textValue == customPropertyText)
						{
							//TODO: replace this with legal spiraAppManager when available
							setLiveFormDropDownFieldValueInternal('TestCaseTypeId', testCaseTypeText);
						}
					}
				}, 5) // 5 millisecond delay since we just need to wait until the outer handler returns

				return true; // (we still want to allow the change to occur)
			});

		}
	});
}

/**
 * Sets the value of a dropdown using an internal Spira method since no 'official' method exists currently
 * @param {*} fieldName 
 * @param {*} textValue 
 */
function setLiveFormDropDownFieldValueInternal(fieldName, textValue)
{
	//First get the list of dropdown options using supoported method
	var options = spiraAppManager.getDropdownItems(fieldName);
	var selectedItemId = 0;
	if (options && options.length)
	{
		for (var i = 0; i < options.length; i++)
		{
			if (options[i].text == textValue)
			{
				selectedItemId = options[i].id;
			}
		}
	}

	//Use internal method to set the value, since no 'official' method exists
	if (selectedItemId)
	{
    	var ddlTestCaseType = $find('cplMainContent_ddlType');
		ddlTestCaseType.set_selectedItem(selectedItemId);
	}
}