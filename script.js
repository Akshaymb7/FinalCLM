// Sample contract data
const contractsData = [
    {
        id: 'CT-2024-001',
        title: 'Software License Agreement',
        client: 'TechCorp Inc.',
        type: 'License Agreement',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-12-15',
        value: '$125,000'
    },
    {
        id: 'CT-2024-002',
        title: 'Maintenance Support Contract',
        client: 'Global Systems Ltd.',
        type: 'Maintenance Contract',
        status: 'expiring',
        startDate: '2023-06-01',
        endDate: '2024-05-31',
        value: '$85,000'
    },
    {
        id: 'CT-2024-003',
        title: 'Cloud Services Agreement',
        client: 'DataFlow Solutions',
        type: 'Service Agreement',
        status: 'active',
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        value: '$200,000'
    },
    {
        id: 'CT-2023-045',
        title: 'Consulting Services Contract',
        client: 'Innovation Hub',
        type: 'Service Agreement',
        status: 'expired',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        value: '$150,000'
    },
    {
        id: 'CT-2024-004',
        title: 'Enterprise Software License',
        client: 'MegaCorp Industries',
        type: 'License Agreement',
        status: 'expiring',
        startDate: '2023-09-15',
        endDate: '2024-09-14',
        value: '$300,000'
    }
];

// Sample audit log data (updated schema)
const auditData = [
    {
        timestamp: '2024-09-08 14:30:25',
        user: 'john.doe@company.com',
        action: 'Bulk Renewal Executed',
        contractsAffected: { count: 3, ids: ['CT-2024-001','CT-2024-002','CT-2024-003'] },
        templateApplied: 'Standard - 12 months',
        renewalDate: '2024-10-01',
        resultSummary: { success: 2, failed: 1 },
        failedContracts: [ { id: 'CT-2024-003', reason: 'Validation error' } ],
        ipAddress: '192.168.1.100'
    },
    {
        timestamp: '2024-09-08 11:15:42',
        user: 'jane.smith@company.com',
        action: 'Contract Modified',
        contractsAffected: { count: 1, ids: ['CT-2024-002'] },
        templateApplied: '-',
        renewalDate: '-',
        resultSummary: { success: 1, failed: 0 },
        failedContracts: [],
        ipAddress: '192.168.1.101'
    }
];

let selectedContracts = new Set();

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    populateContractsTable();
    populateAuditTable();
});

// Tab switching functionality
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab button
    event.target.classList.add('active');
}

// Populate contracts table
function populateContractsTable() {
    const tbody = document.getElementById('contractsTableBody');
    tbody.innerHTML = '';
    
    contractsData.forEach(contract => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="contract-checkbox" value="${contract.id}" onchange="updateSelectedContracts()"></td>
            <td>${contract.id}</td>
            <td>${contract.title}</td>
            <td>${contract.client}</td>
            <td>${contract.type}</td>
            <td><span class="status ${contract.status}">${contract.status}</span></td>
            <td>${contract.startDate}</td>
            <td>${contract.endDate}</td>
            <td>${contract.value}</td>
            <td class="actions">
                <button class="action-btn view" onclick="viewContract('${contract.id}')">View</button>
                <div class="dropdown">
                    <button class="more-btn">More ▼</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="editContract('${contract.id}')">Edit</a>
                        <a href="#" onclick="duplicateContract('${contract.id}')">Duplicate</a>
                        <a href="#" onclick="terminateContract('${contract.id}')">Terminate</a>
                        <a href="#" onclick="exportContract('${contract.id}')">Export</a>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Populate audit table
function populateAuditTable() {
    const tbody = document.getElementById('auditTableBody');
    tbody.innerHTML = '';

    auditData.forEach(log => {
        const row = document.createElement('tr');

        const contractsLabel = `${log.contractsAffected?.count ?? (log.contractId ? 1 : 0)} Contract${(log.contractsAffected?.count ?? (log.contractId ? 1 : 0)) !== 1 ? 's' : ''}`;
        const ids = log.contractsAffected?.ids || (log.contractId ? [log.contractId] : []);
        const idsHtml = ids.length ? `<details><summary>${contractsLabel}</summary><div>${ids.join(', ')}</div></details>` : '-';

        const failed = log.failedContracts && log.failedContracts.length > 0
            ? `<details><summary>${log.failedContracts.length} item${log.failedContracts.length !== 1 ? 's' : ''}</summary><div>${log.failedContracts.map(f => `${f.id} - ${f.reason || 'Unknown reason'}`).join('<br>')}</div></details>`
            : '-';

        const templateApplied = log.templateApplied ?? '-';
        const renewalDate = log.renewalDate ?? '-';
        const resultSummary = log.resultSummary
            ? `${log.resultSummary.success} Succeeded, ${log.resultSummary.failed} Failed`
            : (log.action?.includes('Modified') ? '1 Succeeded, 0 Failed' : '-');

        row.innerHTML = `
            <td>${log.timestamp}</td>
            <td>${log.user}</td>
            <td>${log.action}</td>
            <td>${idsHtml}</td>
            <td>${templateApplied}</td>
            <td>${renewalDate}</td>
            <td>${resultSummary}</td>
            <td>${failed}</td>
            <td>${log.ipAddress}</td>
        `;
        tbody.appendChild(row);
    });
}

// Bulk actions functionality
function toggleBulkActions() {
    const bulkActions = document.getElementById('bulkActions');
    bulkActions.classList.toggle('hidden');
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.contract-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
    
    updateSelectedContracts();
}

function updateSelectedContracts() {
    const checkboxes = document.querySelectorAll('.contract-checkbox:checked');
    selectedContracts.clear();
    
    checkboxes.forEach(checkbox => {
        selectedContracts.add(checkbox.value);
    });
    
    document.getElementById('selectedCount').textContent = 
        `${selectedContracts.size} contract${selectedContracts.size !== 1 ? 's' : ''} selected`;
    
    // Update select all checkbox state
    const allCheckboxes = document.querySelectorAll('.contract-checkbox');
    const selectAllCheckbox = document.getElementById('selectAll');
    
    if (selectedContracts.size === 0) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    } else if (selectedContracts.size === allCheckboxes.length) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.indeterminate = true;
    }
}

// Contract action functions
// Removed per-row renew action; renewal is now handled via bulk modal

function viewContract(contractId) {
    alert(`Viewing contract: ${contractId}`);
}

function editContract(contractId) {
    alert(`Editing contract: ${contractId}`);
}

function duplicateContract(contractId) {
    alert(`Duplicating contract: ${contractId}`);
}

function terminateContract(contractId) {
    if (confirm(`Are you sure you want to terminate contract ${contractId}?`)) {
        alert(`Contract ${contractId} terminated`);
        addAuditEntry('Contract Terminated', contractId, `Contract ${contractId} terminated by user`);
    }
}

function exportContract(contractId) {
    alert(`Exporting contract: ${contractId}`);
}

// Bulk action functions
function bulkRenew() {
    if (selectedContracts.size === 0) {
        alert('Please select contracts to renew');
        return;
    }

    openRenewModal();
}

function bulkExport() {
    if (selectedContracts.size === 0) {
        alert('Please select contracts to export');
        return;
    }
    
    alert(`Exporting ${selectedContracts.size} selected contracts`);
}

function bulkTerminate() {
    if (selectedContracts.size === 0) {
        alert('Please select contracts to terminate');
        return;
    }
    
    if (confirm(`Terminate ${selectedContracts.size} selected contracts? This action cannot be undone.`)) {
        selectedContracts.forEach(contractId => {
            addAuditEntry('Contract Terminated', contractId, `Bulk termination of contract ${contractId}`);
        });
        alert(`${selectedContracts.size} contracts terminated successfully`);
        selectedContracts.clear();
        updateSelectedContracts();
    }
}

// Add new audit entry
function addAuditEntry(action, contractId, details) {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
    
    const newEntry = {
        timestamp: timestamp,
        user: 'current.user@company.com',
        action: action,
        contractsAffected: { count: 1, ids: [contractId] },
        templateApplied: '-',
        renewalDate: '-',
        resultSummary: { success: 1, failed: 0 },
        failedContracts: [],
        ipAddress: '192.168.1.105'
    };
    
    auditData.unshift(newEntry);
    populateAuditTable();
}

// Modal and toast helpers
function openRenewModal() {
    const modal = document.getElementById('renewModal');
    const dateInput = document.getElementById('renewDate');
    if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    modal.classList.remove('hidden');
}

function closeRenewModal() {
    const modal = document.getElementById('renewModal');
    modal.classList.add('hidden');
}

function confirmBulkRenew() {
    const template = document.getElementById('renewTemplate').value;
    const date = document.getElementById('renewDate').value;

    let successCount = 0;
    let failureCount = 0;
    const ids = Array.from(selectedContracts);
    const failedContracts = [];

    selectedContracts.forEach(contractId => {
        try {
            addAuditEntry('Contract Renewed', contractId, `Bulk renewal via template ${template} effective ${date}`);
            successCount++;
        } catch (e) {
            failureCount++;
            failedContracts.push({ id: contractId, reason: e?.message || 'Unknown error' });
        }
    });

    // Add aggregated bulk action entry
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');
    auditData.unshift({
        timestamp: timestamp,
        user: 'current.user@company.com',
        action: 'Bulk Renewal Executed',
        contractsAffected: { count: ids.length, ids },
        templateApplied: resolveTemplateLabel(template),
        renewalDate: date || '-',
        resultSummary: { success: successCount, failed: failureCount },
        failedContracts,
        ipAddress: '192.168.1.105'
    });
    populateAuditTable();

    closeRenewModal();

    showToast(`Renewed ${successCount} contract${successCount !== 1 ? 's' : ''}. ` +
              `${failureCount} failed.`, failureCount ? 'error' : 'success');

    selectedContracts.clear();
    updateSelectedContracts();
}

function resolveTemplateLabel(value) {
    switch (value) {
        case 'standard-12': return 'Standard - 12 months';
        case 'standard-24': return 'Standard - 24 months';
        case 'promo-q4': return 'Promo - Q4 Incentive';
        case 'custom': return 'Custom Terms';
        default: return value || '-';
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3500);
}