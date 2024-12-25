# Building a Perfect Functional Model of Existing Systems to Improve on Them

## **Overview**
We aim to recreate the **current legal and organizational systems** as a **perfectly functional model** in the form of a spatial DOM (sDOM). This forms the entry point where we:

1. **Map the existing structures as they are.**
2. Establish a **baseline for validation** that reflects the current reality, with all its nuances and flaws.
3. Use this baseline to **iteratively improve**, streamline inefficiencies, and innovate within the rules of the system.

---

## **Plan**

### **Phase 1: Create a Perfect Simulation of Existing Structures**

#### **Step 1: Map the Current Legal/Structural System**

1. Break down the hierarchy into multiple layers:
   - **Hierarchy Levels**:
     - **Example**: Nation > State > City > Organizations > Citizens.
   - **Entities**: Governments, businesses, people, contracts, policies, etc.
   - **Rules**: Current laws, policies, workflow systems, and exceptions.

2. Define relationships and roles between different entities.

#### **Step 2: Represent the Entity Structure in an sDOM**
- **Entity == DOM Node**:
  - Example: A country, state, business, or person is represented as a `node` in the DOM-like tree structure.
- Attach **rules** (styles) to each node, which cascade hierarchically.

**Example sDOM Structure for US Legal System**:
```html
<nation name="United States">
  <state name="California">
    <city name="San Francisco">
      <business type="Startup">
        <employee name="John Doe">
          Rules:
            - minimum_wage: 15
            - maximum_hours_per_week: 40
        </employee>
      </business>
    </city>
  </state>
</nation>
```

Personal/cultural exceptions can also be captured as style overrides.

#### **Step 3: Cascading Laws and Rules**
Encode laws and policies as **styles** that cascade appropriately.  
- **Cascading Schema**:
  - Rules defined at the higher level cascade (propagate) to lower levels unless explicitly overridden.

Example:
```json
{
  "rules": {
    "global": { "minimum_wage": 7.25 },
    "california": { "minimum_wage": 15 },
    "san_francisco": { "minimum_wage": 16.50 }
  }
}
```

San Francisco inherits the style but also applies its own override.

---

#### **Step 4: Validate the Model**
- Test the system by running real-world examples (e.g., payroll calculations, legal compliance scenarios).
- Confirm if the **sDOM accurately represents current rules**:
  - Cascading rules work as per legal structures.
  - Overrides and exceptions are applied correctly.
  - No conflicts in interpretation of cascading laws.

---

### **Phase 2: Iterate and Improve**

#### **Step 1: Streamline Bureaucracy**
Use the functional baseline to identify:
- **Redundancies** in rules or policies.
- **Inefficiencies** or contradictions within the system.
- Areas where processes can be automated without breaking existing hierarchy.

##### Example:
Instead of duplicating overlapping laws, the AI simplifies styles through cascading:
```json
{
  "target": "San Francisco",
  "inherits": {
    "from": "California",
    "overrides": {
      "sick_leave_minimum": 5
    }
  }
}
```

#### **Step 2: Add Auditing and Transparency**

For every style applied, ensure rules are:
- Fully **traceable** to their source.
- **Auditable**: People or organizations can query the rationale behind decisions.

Example: